import { PdfReaderComponent } from "./PdfReaderComponent"
import { ToolbarComponent } from "./ToolbarComponent";
import { EventHandlerService, PDFLEvents } from "../services/EventHandlerService";

const pdfjsLib = require("pdfjs-dist");
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer");

class TextRenderComponent {

    constructor(pdfReaderComponent) {
        this.pdfReaderComponent = pdfReaderComponent;
    }
    
    /**
     * Function to render text and links
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

                    //for @matteovisotto: --onLinkLayerRendered--
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