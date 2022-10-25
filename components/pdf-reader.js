const pdfjsLib = require("pdfjs-dist");

class PdfReader {

    constructor() {
        this.initialState = {pdfDoc: null, currentPage: 1, pageCount: 0, zoom: 1};
        this.pageNum = document.querySelector('#page_num');
        this.pageCount = document.querySelector('#page_count');
        this.currentPage = document.querySelector('#current_page');
        this.previousPage = document.querySelector('#prev_page');
        this.nextPage = document.querySelector('#next_page');
        this.zoomIn = document.querySelector('#zoom_in');
        this.zoomOut = document.querySelector('#zoom_out');
        this.canvas = document.querySelector('#canvas');
        this.#registerEvents();
        this.onError = (e) => {};
    }

    loadPdf = (pdf) => {
        const self = this;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "webpack/pdf.worker.bundle.js";
        pdfjsLib.getDocument(pdf).promise.then((data) => {
            self.initialState.pdfDoc = data;
            self.pageCount.textContent = self.initialState.pdfDoc.numPages;
            self.#renderPage();
        }).catch((err) => {
            self.onError(err.message);
        });
    }

    #renderPage = () => {
        const self = this;
        this.initialState.pdfDoc
            .getPage(this.initialState.currentPage)
            .then((page) => {
                const ctx = canvas.getContext('2d');
                const viewport = page.getViewport({
                    scale: self.initialState.zoom,
                });
                self.canvas.height = viewport.height;
                self.canvas.width = viewport.width;

                // Render the PDF page into the canvas context.
                const renderCtx = {
                    canvasContext: ctx,
                    viewport: viewport,
                };

                page.render(renderCtx);

                self.pageNum.textContent = self.initialState.currentPage;
            });
    }

    #registerEvents = () => {
        this.previousPage.addEventListener('click', this.#showPrevPage);
        this.nextPage.addEventListener('click', this.#showNextPage);
        this.currentPage.addEventListener('keypress', this.#currentPageKeypress);
        this.zoomIn.addEventListener('click', this.#zoomIn);
        this.zoomOut.addEventListener('click', this.#zoomOut);
    }

    #showPrevPage = () => {
        if (this.initialState.pdfDoc === null || this.initialState.currentPage <= 1)
            return;
        this.initialState.currentPage--;
        this.currentPage.value = this.initialState.currentPage;
        this.#renderPage();
    };

    #showNextPage = () => {
        if (this.initialState.pdfDoc === null || this.initialState.currentPage >= this.initialState.pdfDoc._pdfInfo.numPages)
            return;

        this.initialState.currentPage++;
        this.currentPage.value = this.initialState.currentPage;
        this.#renderPage();
    };

    #currentPageKeypress = (event) => {
        if (this.initialState.pdfDoc === null) return;
        // Get the key code.
        const keycode = event.keyCode ? event.keyCode : event.which;

        if (keycode === 13) {
            // Get the new page number and render it.
            let desiredPage = this.currentPage.valueAsNumber;
            this.initialState.currentPage = Math.min(
                Math.max(desiredPage, 1),
                this.initialState.pdfDoc._pdfInfo.numPages,
            );

            this.currentPage.value = this.initialState.currentPage;
            this.#renderPage();
        }
    }

    #zoomIn = (event) => {
        if (this.initialState.pdfDoc === null) return;
        this.initialState.zoom *= 4 / 3;
        this.#renderPage();
    }

    #zoomOut = (event) => {
        if (this.initialState.pdfDoc === null) return;
        this.initialState.zoom *= 2 / 3;
        this.#renderPage();
    }

}

exports.PdfReader = PdfReader;

