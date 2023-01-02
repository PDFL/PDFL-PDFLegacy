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
 * @property {HTMLElement} components.contentDiv div containing the content of the reference img/table/text/pdf
 * @property {HTMLElement} components.sidePageReferenceBtn button that open the two page layout view
 * @property {HTMLElement} components.sidePageReferenceContainer canvas for the pdf reference
 * @property {HTMLElement} components.main button that open the two page layout view
 * @property {HTMLElement} components.sideNav div that contain the graph
 * @property {HTMLElement} components.closeBtnReference button for close the reference page
 */

class ReferenceViewComponent {
  components = {
    contentDiv: document.querySelector("#content-reference-div"),
    sidePageReferenceBtn: document.querySelector("#side-page-reference-btn"),
    sidePageReferenceContainer: document.createElement("div"),
    sideNav: document.querySelector("#side-page"),
    closeBtnReference: document.createElement("button"),
    openNew: document.querySelector("#open-new-pdf"),
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
    this.main = document.querySelector("#main");
    this.pdfContainer = document.querySelector("#pdf-container");
    this.#registerEvents();
    this.components.canvas.setAttribute("class", "canvas-for-reference");
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

    this.components.openNew.addEventListener(
      "click",
      this.#hidePdfReference.bind(this)
    );
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
   * Handler for graph maker view opening, hides the reference view to show the graph
   * @private
   */
  #hidePdfReferenceToShowGraph = () => {
    this.components.sidePageReferenceContainer.className = "no-width";
    if(this.components.closeBtnReference && this.components.closeBtnReference.parentElement == this.components.main)
      this.components.main.removeChild(this.components.closeBtnReference);
  };

  /**
   * Creates event triggered when graoh maker button is clicked to hide the reference pdf and show the
   * main pdf in full width
   * @private
   */
  #hidePdfReference = () => {
    this.main.removeChild(this.components.sidePageReferenceContainer);
    this.components.closeBtnReference.className = "hidden";
    this.pdfContainer.className = "full-width";  };

  /**
   * Handler to display the reference page.
   * @private
   */
  #showPdfReference = () => {
    this.pdfContainer.className = "half-width";
    this.components.closeBtnReference.setAttribute("id", "close-btn-reference");
    this.components.closeBtnReference.classList.remove("hidden");
    this.components.closeBtnReference.innerHTML = "<a>&times;</a>";
    this.main.appendChild(this.components.sidePageReferenceContainer);
    this.main.appendChild(this.components.closeBtnReference);
  };

  /**
   * Call back to renders the reference page.
   * @private
   */
  #renderPdfReference = (pageNumber) => {
    this.components.sideNav.className = "no-width";
    this.components.sidePageReferenceContainer.setAttribute(
      "id",
      "side-page-reference-container"
    );

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
