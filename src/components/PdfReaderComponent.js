import { EventHandlerService, PDFLEvents } from '../services/EventHandlerService';
import { PaginationComponent } from './PaginationComponent';
import { ZoomComponent } from './ZoomComponent';

const pdfjsLib = require("pdfjs-dist");

//Global variables to be used in different functions
let canvas, textLayer, ctx, viewport, renderCtx;

class PdfReaderComponent {

    components = {
        pdfContainer: document.querySelector('#pdf_container'),
        openNew: document.querySelector('#open_new')
    }

    /**
     * @constructor
     */
    constructor() {
        if (PdfReaderComponent._instance) {
            PdfReaderComponent._instance.init();
            return PdfReaderComponent._instance;
        }
        PdfReaderComponent._instance = this;

        this.init();
        this.#registerEvents();
    }

    init = () => {
        this.paginationComponent = new PaginationComponent();
        this.zoomComponent = new ZoomComponent();
    }

    /**
     * Add event listener to view elements of the toolbar
     */
    #registerEvents = () => {
        this.components.openNew.addEventListener('click', this.#onNewFile);

        EventHandlerService.subscribe(PDFLEvents.onRenderPage, () => {
            this.#renderPage();
            this.#renderText();
        });
    }

    #onNewFile = () => {
        EventHandlerService.publish(PDFLEvents.onShowInputView);
    }

    /**
     * Load and render the first page of the given pdf
     * @param pdf data, filename or url of a PDF document
     */
    loadPdf = (pdf) => {
        const self = this;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "webpack/pdf.worker.bundle.js";
        pdfjsLib.getDocument(pdf).promise.then((data) => {
            self.pdfDoc = data;
            self.paginationComponent.setPageCount(data.numPages);
            self.#renderPage();
            self.#renderText();
        }).catch((err) => {
            console.log(err.message); // TODO: handle error in some way
        });
    }

    /**
     * Private function to render the page 
     */
    #renderPage = () => {
        const self = this;
        this.pdfDoc
            .getPage(this.paginationComponent.getCurrentPage())
            .then((page) => {

                //Set the HTML properties
                canvas = document.createElement("canvas");
                canvas.setAttribute('class', 'canvas__container');

                ctx = canvas.getContext('2d');
                viewport = page.getViewport({
                    scale: this.zoomComponent.getZoom(),
                });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render the PDF page into the canvas context
                renderCtx = {
                    canvasContext: ctx,
                    viewport: viewport,
                };

                page.render(renderCtx);

                //Scroll is possible but not supported by other navigation functions, clear container before adding the new page
                this.components.pdfContainer.innerHTML = "";
                this.components.pdfContainer.appendChild(canvas);
                this.paginationComponent.setCurrentPage();
            });
    }

    /**
     * Private function to render the text 
     */
    #renderText = () => {
        const self = this;
        this.pdfDoc
            .getPage(this.paginationComponent.getCurrentPage())
            .then((page) => {

                //Set the HTML properties
                textLayer = document.createElement("div");
                textLayer.setAttribute('class', 'textLayer');

                page.getTextContent().then(function (textContent) {

                    textLayer.style.left = canvas.offsetLeft + 'px';
                    textLayer.style.top = canvas.offsetTop + 'px';
                    textLayer.style.height = canvas.offsetHeight + 'px';
                    textLayer.style.width = canvas.offsetWidth + 'px';

                    //Render the text inside the textLayer container
                    pdfjsLib.renderTextLayer({
                        textContent: textContent,
                        container: textLayer,
                        viewport: viewport,
                        textDivs: []
                    });

                });

                //Display the container
                self.components.pdfContainer.appendChild(textLayer);
            });

    }

}

export { PdfReaderComponent };