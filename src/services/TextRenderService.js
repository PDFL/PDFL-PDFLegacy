import { EventHandlerService, PDFLEvents } from "./EventHandlerService";
import { ToolbarComponent } from "../components/ToolbarComponent";
/**
 * Declaration of library that contains the method to render text and annotations
 * @constant
 */
const pdfjsLib = require("pdfjs-dist");
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer");

/**
 * Function to render the page.
 * @param {pdfDoc} pdfDoc PDF document
 * @param {Object} component object that holds DOM elements that are within component
 * @param {ToolbarComponent} toolbar toolbar component within the reader
 */
 export function renderPage(pdfDoc, component, toolbar) {

    pdfDoc
      .getPage(toolbar.getCurrentPage())
      .then((page) => {

        //Set the HTML properties
        component.canvas = document.createElement("canvas");
        component.canvas.setAttribute("class", "canvas__container");

        const ctx = component.canvas.getContext("2d");
        component.viewport = page.getViewport({
          scale: toolbar.getZoom(),
        });
        component.canvas.height = component.viewport.height;
        component.canvas.width = component.viewport.width;

        // Render the PDF page into the canvas context.
        const renderCtx = {
          canvasContext: ctx,
          viewport: component.viewport,
        };

        page.render(renderCtx);

        // Scroll is possible but not supported by other navigation functions, clear container before adding the new page
        component.pdfContainer.innerHTML = "";
        component.pdfContainer.appendChild(component.canvas);
        toolbar.setCurrentPage();

        // Function to render the text layer and the relatives links
        renderText(pdfDoc, component, toolbar);
      });
      
  };


/**
 * Function to create the layer for text and links.
 * @param {pdfDoc} pdfDoc PDF document
 * @param {Object} component object that holds DOM elements that are within component
 * @param {ToolbarComponent} toolbar toolbar component within the reader
 */
export function renderText(pdfDoc, component, toolbar) { 

    pdfDoc
        .getPage(toolbar.getCurrentPage())
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


/**
 * Function to hide links during the text selection
 */
export function hideLinks() {
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
