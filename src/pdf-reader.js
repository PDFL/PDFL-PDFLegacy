import {EventBus, PDFLEvents} from './event-bus';
import {PageNavigatorComponent} from './components/page-navigator-component';
import {ZoomComponent} from './components/zoom-component';
const pdfjsLib = require("pdfjs-dist");

/**
 * Main controller for the PDF Reader
 */
class PdfReader {
    /**
     * @constructor
     * @param viewComponents (object) elements of the view
     */
    constructor(viewComponents) {
        this.initialState = {pdfDoc: null, currentPage: 1, pageCount: 0, zoom: 1};
        this.viewComponents = viewComponents;
        this.components = {};
        this.#initReader();
    }

    /**
     * Clear reader state and prepare for new file
     */
    clearReader = () => {
        this.initialState.pdfDoc = null;
        this.initialState.currentPage = 1;
        this.initialState.pageCount = 0;
    }

    /**
     * Load and render the first page of the given pdf
     * @param pdf data, filename or url of a PDF document
     */
    loadPdf = (pdf) => {
        const self = this;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "webpack/pdf.worker.bundle.js";
        pdfjsLib.getDocument(pdf).promise.then((data) => {
            self.initialState.document = data;
            self.viewComponents.navigation.pageCount.textContent = self.initialState.document.numPages;
            self.#renderPage();
        }).catch((err) => {
            EventBus.publish(PDFLEvents.onPdfReaderError, err.message);
        });
    }

    /**
     * Private function, render the page contained in initialState.currentPage
     */
    #renderPage = () => {
        const self = this;
        this.initialState.document
            .getPage(self.initialState.currentPage)
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
                self.viewComponents.navigation.pageNum.textContent = self.initialState.currentPage;
            });
    }

    /**
     * Add event listener to view elements of the toolbar
     */
    #initReader = () => {

        this.viewComponents.openNew.addEventListener('click', this.#onNewFile);
        this.components['pageNavigator'] = new PageNavigatorComponent(this.viewComponents.navigation, this.initialState);
        this.components['zoom'] = new ZoomComponent(this.viewComponents.zoom, this.initialState);
        const self = this;
        EventBus.subscribe(PDFLEvents.onRenderRequest, () => {
            self.#renderPage();
        });

    }

    #onNewFile = (event) => {
        this.clearReader();
        EventBus.publish(PDFLEvents.onNewFile);
    }

}


export {PdfReader};

