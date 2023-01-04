import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import * as textRenderService from "../services/TextRenderService";

import { KnowledgeGraphComponent } from "../components/KnowledgeGraphComponent";

/**
 * Declaration of library that contains the method to render text and annotations
 * @constant
 */
const pdfjsLib = require("pdfjs-dist");

/**
 * Component representing two page layout and display dynamically the content of it
 *
 *
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.pdfContainer element containing the PDF reader
 * @property {HTMLElement} components.canvas canvas for the pdf reference
 * @property {HTMLElement} components.closeBtn button for close the reference page
 * @property {HTMLElement} pdfDoc pdf of the user
 */

class ReferenceViewComponent {
  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    canvas: document.querySelector("#reference-canvas"),
    closeBtn: document.querySelector("#reference-close-btn"),
    container: document.querySelector("#reference-container"),
  };

  /**
   * Creates the endler service for manage the reference object
   * @constructor
   */
  constructor() {
    this.pdfDoc = null;
    this.pdfPageNumber = null;
    this.viewport = null;
    this.main = document.querySelector("#main");
    this.pdfContainer = document.querySelector("#pdf-container");
    this.#registerEvents();
    this.components.canvas.setAttribute("class", "canvas-for-reference");
  }

  /**
   * Adds event listeners to component and it's elements.
   * @private
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(
      PDFLEvents.onReferencePdfOpen,
      (pageNumber) => {
        this.#displayPdfReference(pageNumber);
      }
    );

    this.components.closeBtn.addEventListener("click", () => {
      this.#hidePdfReference();
    });

    EventHandlerService.subscribe(PDFLEvents.onSidePageDisplayed, () => {
      this.#hidePdfReference(false);
    });

    EventHandlerService.subscribe(PDFLEvents.onReadNewPdf, (pdf) => {
      this.#setPDF(pdf);
    });
  };

  /**
   * Creates event triggered when two page layout button is clicked
   * @private
   */
  #displayPdfReference = (pageNumber) => {
    this.#renderPdfReference(pageNumber);
    this.#showPdfReference();
  };

  /**
   * Call back to renders the reference page.
   * @private
   */
  #renderPdfReference = async (pageNumber) => {
    //TODO: code repetition - extract page rendering
    const page = await this.pdfDoc.getPage(pageNumber);

    const ctxReference = this.components.canvas.getContext("2d");
    const viewport = page.getViewport({
      scale: 1,
    });

    page.render({
      canvasContext: ctxReference,
      viewport: viewport,
    });

    this.#setCanvasDimensions(viewport.height, viewport.width);
    this.#positionCloseButton(viewport.width);
  };

  #setCanvasDimensions = (height, width) => {
    this.components.canvas.height = height;
    this.components.canvas.width = width;
  };

  #positionCloseButton = (offset) => {
    const halfButtonWidth = 25;
    this.components.closeBtn.style.right = offset + halfButtonWidth + "px";
  };

  /**
   * Handler to display the reference page.
   * @private
   */
  #showPdfReference = () => {
    this.components.pdfContainer.className = "half-width";
    this.components.container.classList.remove("hidden");
  };

  /**
   * Creates event triggered when graoh maker button is clicked to hide the reference pdf and show the
   * main pdf in full width
   * @private
   * @param {boolean} isDefaultReaderDisplay if true (default) reader will be displayed
   * in full width and half width otherwise
   */
  #hidePdfReference = (isDefaultReaderDisplay = true) => {
    this.components.container.classList.add("hidden");
    this.components.pdfContainer.className = isDefaultReaderDisplay
      ? "full-width"
      : "half-width";
  };

  /**
   * Sets the PDF document.
   * @private
   * @param {PDFDocumentProxy} pdfDocument PDF document
   */
  #setPDF = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
  };
}

export { ReferenceViewComponent };
