const pdfjsLib = require("pdfjs-dist");

class PdfReader {
    /**
     * @constructor
     * @param viewComponents (object) elements of the view
     */
    constructor(viewComponents) {
        this.initialState = {pdfDoc: null, currentPage: 1, pageCount: 0, zoom: 1};
        this.viewComponents = viewComponents;
        this.#registerEvents();
        this.onError = (e) => {};
    }

    /**
     * Load and render the first page of the given pdf
     * @param pdf data, filename or url of a PDF document
     */
    loadPdf = (pdf) => {
        const self = this;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "webpack/pdf.worker.bundle.js";
        pdfjsLib.getDocument(pdf).promise.then((data) => {
            self.initialState.pdfDoc = data;
            self.viewComponents.pageCount.textContent = self.initialState.pdfDoc.numPages;
            self.#renderPage();
        }).catch((err) => {
            self.onError(err.message);
        });
    }

    /**
     * Private function, render the page contained in initialState.currentPage
     */
    #renderPage = () => {
        const self = this;
        this.initialState.pdfDoc
            .getPage(this.initialState.currentPage)
            .then((page) => {
                var canvas = document.createElement( "canvas" );
                canvas.setAttribute('class', 'canvas__container');
                const ctx = canvas.getContext('2d');
                const viewport = page.getViewport({
                    scale: self.initialState.zoom,
                });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render the PDF page into the canvas context.
                const renderCtx = {
                    canvasContext: ctx,
                    viewport: viewport,
                };

                page.render(renderCtx);
                self.viewComponents.pdfContainer.innerHTML = ""; //Scroll is possible but not supported by other navigation functions, clear container before adding the new page
                self.viewComponents.pdfContainer.appendChild(canvas);
                self.viewComponents.pageNum.textContent = self.initialState.currentPage;
            });
    }

    /**
     * Add event listener to view elements of the toolbar
     */
    #registerEvents = () => {
        this.viewComponents.previousPage.addEventListener('click', this.#showPrevPage);
        this.viewComponents.nextPage.addEventListener('click', this.#showNextPage);
        this.viewComponents.currentPage.addEventListener('keypress', this.#currentPageKeypress);
        this.viewComponents.zoomIn.addEventListener('click', this.#zoomIn);
        this.viewComponents.zoomOut.addEventListener('click', this.#zoomOut);
    }

    /**
     * Callback for the previous page event. Render the previous page of the current one if available
     */
    #showPrevPage = () => {
        if (this.initialState.pdfDoc === null || this.initialState.currentPage <= 1)
            return;
        this.initialState.currentPage--;
        this.viewComponents.currentPage.value = this.initialState.currentPage;
        this.#renderPage();
    };

    /**
     * Callback for the next page event. Render the next page of the current one if available
     */
    #showNextPage = () => {
        if (this.initialState.pdfDoc === null || this.initialState.currentPage >= this.initialState.pdfDoc._pdfInfo.numPages)
            return;

        this.initialState.currentPage++;
        this.viewComponents.currentPage.value = this.initialState.currentPage;
        this.#renderPage();
    };

    /**
     * Callback for page number input listener. Render the given page if available
     * @param event
     */
    #currentPageKeypress = (event) => {
        if (this.initialState.pdfDoc === null) return;
        // Get the key code.
        const keycode = event.keyCode ? event.keyCode : event.which;

        if (keycode === 13) {
            // Get the new page number and render it.
            let desiredPage = this.viewComponents.currentPage.valueAsNumber;
            this.initialState.currentPage = Math.min(
                Math.max(desiredPage, 1),
                this.initialState.pdfDoc._pdfInfo.numPages,
            );

            this.viewComponents.currentPage.value = this.initialState.currentPage;
            this.#renderPage();
        }
    }

    /**
     * Callback for zoom in event
     * @param event
     */
    #zoomIn = (event) => {
        if (this.initialState.pdfDoc === null) return;
        this.initialState.zoom *= 4 / 3;
        this.#renderPage();
    }

    /**
     * Callback for the zoom out action
     * @param event
     */
    #zoomOut = (event) => {
        if (this.initialState.pdfDoc === null) return;
        this.initialState.zoom *= 2 / 3;
        this.#renderPage();
    }

}

exports.PdfReader = PdfReader;

