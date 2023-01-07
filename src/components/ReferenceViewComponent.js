import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import * as textRenderService from "../services/TextRenderService";

/**
 * Declaration of library that contains the method to render text and annotations
 * @constant
 */
const pdfjsLib = require("pdfjs-dist");

/**
 * Component representing two page layout and display dynamically the content of it
 *
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.sidePageReferenceContainer canvas for the pdf reference
 * @property {HTMLElement} components.closeBtnReference button for close the reference page
 * @property {HTMLElement} components.canvas canvas containing the page of the reference
 */

class ReferenceViewComponent {
  components = {
    sidePageReferenceContainer: document.querySelector(
      "#side-page-reference-container"
    ),
    closeBtnReference: document.querySelector("#close-btn-reference"),
    canvas: document.createElement("canvas"),
  };

  /**
   * Creates the endler service for manage the reference object
   * @constructor
   */
  constructor() {
    this.pdfDoc = null;
    this.pdfPageNumber = null;
    this.viewport = null;
    this.pdfContainer = document.querySelector("#pdf-container");
    this.components.canvas.setAttribute("class", "canvas-for-reference");

    this.#registerEvents();
  }

  /**
   * Set the pdf document
   * @param pdfDoc
   */
  setPdfDoc = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
  };

  /**
   * Adds event listeners to component and it's elements.
   * @private
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(
      PDFLEvents.onReferencePdfOpen,
      this.#displayPdfReference.bind(this)
    );
    this.components.closeBtnReference.addEventListener(
      "click",
      this.#hidePdfReference.bind(this)
    );
  };

  /**
   * Creates event triggered when two page layout button is clicked
   * @private
   */
  #displayPdfReference = (pageNumber) => {
    EventHandlerService.publish(PDFLEvents.onOpenReference);
    this.#renderPdfReference(pageNumber);
    this.#showPdfReference();
  };

  /**
   * Hides reference
   * @private
   */
  #hidePdfReference = () => {
    this.components.sidePageReferenceContainer.classList.add("hidden");
    this.components.closeBtnReference.classList.add("hidden");
    this.pdfContainer.className = "full-width";
  };

  /**
   * Display reference
   * @private
   */
  #showPdfReference = () => {
    this.components.sidePageReferenceContainer.classList.remove("hidden");
    this.components.closeBtnReference.classList.remove("hidden");
  };

  /**
   * Call back to renders the reference page.
   * @private
   */
  #renderPdfReference = (pageNumber) => {
    if (this.pdfDoc === null) {
      throw new Error("PDFDocument object missed");
    }

    textRenderService.renderPageReference(
      this.pdfDoc,
      this.components,
      pageNumber,
      this.viewport
    );
  };
}

export { ReferenceViewComponent };
