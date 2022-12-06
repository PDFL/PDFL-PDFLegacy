import { EventHandlerService, PDFLEvents } from "./EventHandlerService";
import { ToolbarComponent } from "../components/ToolbarComponent";
import { PdfReaderComponent } from "../components/PdfReaderComponent";
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
 * @param {HTMLElement} textLayer text layer DOM element
 */
export function renderPage(pdfDoc, component, toolbar, textLayer) {
  pdfDoc.getPage(toolbar.getCurrentPage()).then((page) => {
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
    renderText(pdfDoc, component, toolbar, textLayer);
  });
}

/**
 * Function to create the layer for text and links.
 * @param {pdfDoc} pdfDoc PDF document
 * @param {Object} component object that holds DOM elements that are within component
 * @param {ToolbarComponent} toolbar toolbar component within the reader
 * @param {HTMLElement} textLayer text layer DOM element
 */
export function renderText(pdfDoc, component, toolbar, textLayer) {
  pdfDoc.getPage(toolbar.getCurrentPage()).then((page) => {
    page.getTextContent().then(function (textContent) {
      //Render the text inside the textLayer container
      pdfjsLib.renderTextLayer({
        textContent: textContent,
        container: textLayer,
        viewport: component.viewport,
        textDivs: [],
      });
    });

    const pdfLinkService = new pdfjsViewer.PDFLinkService();

    page.getAnnotations().then(function (annotationsData) {
      positionTextLayer(textLayer, component);

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
}

/**
 * Function to hide links during the text selection
 */
export function hideLinks() {
  var textSel = window.getSelection();
  var links = document.getElementsByClassName("linkAnnotation");

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

/**
 * Positions the textLayer DOM element to the correct location
 * to fix the displayed text of the pdf.
 *
 * @param {Object} components object that holds DOM elements that are within component
 * @param {HTMLElement} textLayer
 */
export function positionTextLayer(textLayer, components) {
  textLayer.style.left = components.canvas.offsetLeft + "px";
  textLayer.style.top = components.canvas.offsetTop + "px";
  textLayer.style.height = components.viewport.offsetHeight + "px";
  textLayer.style.width = components.viewport.offsetWidth + "px";
}
