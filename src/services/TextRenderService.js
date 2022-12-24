import { EventHandlerService, PDFLEvents } from "./EventHandlerService";
/**
 * Declaration of library that contains the method to render text and annotations
 * @constant
 */
const pdfjsLib = require("pdfjs-dist");
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer");

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
 * Creates the text layer DOM node if it does not already exist.
 * Id of the element will be 'text-layer-{pageNum}'.
 *
 * @param {int} pageNum
 */
function createTextLayerDOMIfNotExist(pageNum) {
  let textLayer = document.querySelector(`#text-layer-${pageNum}`);
  if (textLayer) {
    textLayer.innerHTML = "";
  } else {
    textLayer = document.createElement("div");
    textLayer.setAttribute("id", `text-layer-${pageNum}`);
    textLayer.setAttribute("class", "textLayer");
  }
  return textLayer;
}

/**
 * Renders the text layer and links (references) for a given page.
 *
 * @param {PDFPage} page
 * @param {int} pageNum
 * @param {HTMLElement} canvas
 * @param {import("pdfjs-dist").PageViewport} viewport
 */
export function renderText(page, pageNum, canvas, viewport) {
  const textLayer = createTextLayerDOMIfNotExist(pageNum);

  page.getTextContent().then(function (textContent) {
    renderTextLayer(textContent, textLayer, viewport);
    positionTextLayer(textLayer, canvas);
    renderLinkLayer(page, textLayer, viewport);
  });

  //Display the container
  document.querySelector("#pdf-container").appendChild(textLayer);
}

/**
 * Positions the textLayer DOM element to the correct location
 * of the canvas (page).
 *
 * @param {HTMLElement} textLayer text layer to position
 * @param {HTMLElement} canvas canvas of the pdf.js page
 */
export function positionTextLayer(textLayer, canvas) {
  textLayer.style.left = canvas.offsetLeft + "px";
  textLayer.style.top = canvas.offsetTop + "px";
  textLayer.style.height = canvas.offsetHeight + "px";
  textLayer.style.width = canvas.offsetWidth + "px";
}

/**
 * Gets the width and height as pixels from the given zoom scale.
 *
 * @param {PDFDoc} pdfDoc
 * @param {float} zoomScale
 * @returns {[int, int]} width and height
 */
export async function getPageSize(pdfDoc, zoomScale) {
  let page = await pdfDoc.getPage(1);
  let viewport = await page.getViewport({ scale: zoomScale });

  return [viewport.width, viewport.height];
}

/**
 * Renders the text layer to the text layer DOM element for a given viewport
 * with text content.
 *
 * @param {import("pdfjs-dist/types/src/display/api").TextContent} textContent
 * @param {HTMLElement} textLayer
 * @param {import("pdfjs-dist").PageViewport} viewport
 */
function renderTextLayer(textContent, textLayer, viewport) {
  pdfjsLib.renderTextLayer({
    textContent: textContent,
    container: textLayer,
    viewport: viewport,
    textDivs: [],
  });
}

/**
 * Renders the links (annotations) layer for a page.
 * Publishes and event that the links layer has been rendered for a
 * selected text layer.
 *
 * @param {Page} page pdf-js Page object
 * @param {HTMLElement} textLayer
 */
function renderLinkLayer(page, textLayer, viewport) {
  const pdfLinkService = new pdfjsViewer.PDFLinkService();
  page.getAnnotations().then(function (annotationsData) {
    pdfjsLib.AnnotationLayer.render({
      div: textLayer,
      viewport: viewport.clone({ dontFlip: true }),
      annotations: annotationsData,
      page: page,
      linkService: pdfLinkService,
      enableScripting: true,
      renderInteractiveForms: true,
    });

    EventHandlerService.publish(PDFLEvents.onLinkLayerRendered, textLayer);
  });
}
