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
    #renderPage ()  {
        var pageRendering = true;
        var pageNumPending = null;
        const self = this;
        this.initialState.document
            .getPage(self.initialState.currentPage)
            .then(function(page) {
                //Set the HTML properties
                const canvas = document.createElement( "canvas" );
                canvas.setAttribute('class', 'canvas__container');
                const textLayer = document.createElement("div");
                textLayer.setAttribute('class', 'textLayer')
                const ctx = canvas.getContext('2d');

                const viewport = page.getViewport({scale: self.initialState.zoom,});
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render the PDF page into the canvas context.
                const renderCtx = {
                    canvasContext: ctx,
                    viewport: viewport,
                };

                var renderTask = page.render(renderCtx);

                renderTask.promise.then(function() {
                    pageRendering = false;
                    if(pageNumPending !== null) {
                        renderPage();
                        pageNumPending = null;

                        //Cannot use the same canvas during multiple render, maybe it should be moved from here
                        if (ctx) {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.beginPath();
                        }
                    }
                }).then(function() {
                    
                    page.getTextContent().then(function(textContent){

                        textLayer.style.left = canvas.offsetLeft + 'px';
                        textLayer.style.top = canvas.offsetTop + 'px';
                        textLayer.style.height = canvas.offsetHeight + 'px';
                        textLayer.style.width = canvas.offsetWidth + 'px';

                        pdfjsLib.renderTextLayer({
                            textContent: textContent,
                            container: textLayer,
                            viewport: viewport,
                            textDivs: []
                        });
                    
                    });
                })

                page.render(renderCtx);
                
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.beginPath();
                }
                
                self.viewComponents.pdfContainer.innerHTML = ""; //Scroll is possible but not supported by other navigation functions, clear container before adding the new page
                self.viewComponents.pdfContainer.appendChild(canvas);
                self.viewComponents.navigation.pageNum.textContent = self.initialState.currentPage;
                self.viewComponents.pdfContainer.appendChild(textLayer);
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

