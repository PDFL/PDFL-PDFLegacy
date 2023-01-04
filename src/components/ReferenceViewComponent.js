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
 * Component representing the page containing the cross reference content. Content
 * dynamically changes when new cross reference is opened. This component is displayed
 * as a page next to current page of PDF that user is reading.
 * @property {Object} components object that holds DOM elements that represent this component
 * @property {HTMLElement} components.pdfContainer PDF reader container
 * @property {HTMLElement} components.canvas canvas containing the whole page where reference is
 * @property {HTMLElement} components.closeBtn button that closes this component
 * @property {HTMLElement} components.container placeholder of this whole component
 * @property {HTMLElement} pdfDoc PDF document that is currently being read
 */

class ReferenceViewComponent {
  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    canvas: document.querySelector("#reference-canvas"),
    closeBtn: document.querySelector("#reference-close-btn"),
    container: document.querySelector("#reference-container"),
  };

  /**
   * Creates new ReferenceViewComponent object and registers events to it.
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
   * Opens new side page and sets it's content to page where reference is.
   * @private
   * @param {int} pageNumber number of page where reference is
   */
  #displayPdfReference = (pageNumber) => {
    this.#renderPdfReference(pageNumber);
    this.#showPdfReference();
  };

  /**
   * Renders the reference page inside this component.
   * @private
   * @async
   * @param {int} pageNumber number of page where reference is
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

  /**
   * Sets hight and width of canvas inside this component
   * to given hight and width.
   * @private
   * @param {int} height height to be set
   * @param {int} width width to be set
   */
  #setCanvasDimensions = (height, width) => {
    this.components.canvas.height = height;
    this.components.canvas.width = width;
  };

  /**
   * Positions the close button left outside of canvas.
   * @param {int} offset width of canvas
   */
  #positionCloseButton = (offset) => {
    const halfButtonWidth = 25;
    this.components.closeBtn.style.right = offset + halfButtonWidth + "px";
  };

  /**
   * Displays this component in half of reader view.
   * @private
   */
  #showPdfReference = () => {
    this.components.pdfContainer.className = "half-width";
    this.components.container.classList.remove("hidden");
  };

  /**
   * Hides this component and displays reader in full width (default reader view) 
   * or half width which depends isDefaultReaderDisplay parameter.
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
