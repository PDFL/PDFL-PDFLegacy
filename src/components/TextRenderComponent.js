import { PdfReaderComponent } from "./PdfReaderComponent"
import { ToolbarComponent } from "./ToolbarComponent";
import { EventHandlerService, PDFLEvents } from "../services/EventHandlerService";

/**
 * Declaration of library that contains the method to render text and annotations
 * @constant
 */
const pdfjsLib = require("pdfjs-dist");
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer");

/**
 * Component representing the text and annotation of the PDF.
 * It realizes the under layer composed by text and relative annotations.
 */
class TextRenderComponent {

    /**
   * Initialize by reference the pdf reader component. To use all components
   * that are helpful to create the text layer and the annotation layer.
   * @constructor
   */
    constructor(pdfReaderComponent) {
        this.pdfReaderComponent = pdfReaderComponent;
    }
    
    /**
     * Function to create the layer for text and links.
     * @param {pdfDoc} pdfDoc PDF document
     */
    renderText(pdfDoc) {
        const component = this.pdfReaderComponent.components;

        pdfDoc
            .getPage(this.pdfReaderComponent.toolbarComponent.getCurrentPage())
            .then((page) => {

                //Set the HTML properties
                const textLayer = document.createElement("div");
                textLayer.setAttribute('class', 'textLayer');

                page.getTextContent().then(function (textContent) {

                    textLayer.style.left = component.canvas.offsetLeft + 'px';
                    textLayer.style.top = component.canvas.offsetTop + 'px';
                    textLayer.style.height = component.canvas.offsetHeight + 'px';
                    textLayer.style.width = component.canvas.offsetWidth + 'px';

                    //Render the text inside the textLayer container
                    pdfjsLib.renderTextLayer({
                        textContent: textContent,
                        container: textLayer,
                        viewport: component.viewport,
                        textDivs: []
                    });

                });

                const pdfLinkService = new pdfjsViewer.PDFLinkService();

                page.getAnnotations().then(function (annotationsData) {

                    textLayer.style.left = component.canvas.offsetLeft + 'px';
                    textLayer.style.top = component.canvas.offsetTop + 'px';
                    textLayer.style.height = component.viewport.offsetHeight + 'px';
                    textLayer.style.width = component.viewport.offsetWidth + 'px';


                    //Render the text inside the textLayer container
                    pdfjsLib.AnnotationLayer.render({
                        div: textLayer,
                        viewport: component.viewport.clone({ dontFlip: true }),
                        annotations: annotationsData,
                        page: page,
                        linkService: pdfLinkService,
                        enableScripting: true,
                        renderInteractiveForms: true,
                    });

                    EventHandlerService.publish(PDFLEvents.onLinkLayerRendered);
                });

                //Display the container
                component.pdfContainer.appendChild(textLayer);
            });

    };

}

/**
 * Function to hide links during the text selection
 */
async function hideLinks() {
    var textSel = window.getSelection();
    var links = document.getElementsByClassName('linkAnnotation');

    if (textSel == 0) {
        for (let i = 0; i <= links.length - 1; i++) {
            links[i].style.display = "block";
        }
    } else {
        for (let i = 0; i <= links.length - 1; i++) {
            links[i].style.display = "none";
        }
    }
}

export { TextRenderComponent, hideLinks };