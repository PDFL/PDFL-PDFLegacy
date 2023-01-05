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
 *
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.contentDiv div containing the content of the reference img/table/text/pdf
 * @property {HTMLElement} components.sidePageReferenceBtn button that open the two page layout view
 * @property {HTMLElement} components.sidePageReferenceContainer canvas for the entire reference
 * @property {HTMLElement} components.canvas canvas that contain the rendered page
 * @property {HTMLElement} components.graphMakerBtn button that generates knowledge graph to manage the request
 * of knowledge graph display when pdf reference is displayed
 * @property {HTMLElement} components.sideNav div that contain the graph
 * @property {HTMLElement} components.closeBtnReference button for close the reference page
 * @property {HTMLElement} components.openNew button to open a new pdf
 */

class ReferenceViewComponent {
  components = {
    contentDiv: document.querySelector("#content-reference-div"),
    sidePageReferenceBtn: document.querySelector("#side-page-reference-btn"),
    sidePageReferenceContainer: document.createElement("div"),
    canvas: null,
    graphMakerBtn: document.querySelector("#graph-maker"),
    sideNav: document.querySelector("#side-page"),
    closeBtnReference: document.createElement("button"),
    openNew: document.querySelector("#open-new-pdf"),
  };

  /**
   * Creates the endler service for manage the reference object
   * @constructor
   */
  constructor() {
    this.#registerEvents();
    this.pdfDoc = null;
    this.pdfPageNumber = null;
    this.viewport = null;
    this.main = document.querySelector("#main");
    this.pdfContainer = document.querySelector("#pdf-container");

    this.components.canvas = document.createElement("canvas");
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

    this.components.graphMakerBtn.addEventListener(
      "click",
      this.#hidePdfReferenceToShowGraph.bind(this)
    );

    this.components.closeBtnReference.addEventListener(
      "click",
      this.hidePdfReference.bind(this)
    );

    this.components.openNew.addEventListener(
      "click",
      this.hidePdfReference.bind(this)
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
    this.main.removeChild(this.components.closeBtnReference);
  };

  /**
   * Creates event triggered when graoh maker button is clicked to hide the reference pdf and show the
   * main pdf in full width
   */
  hidePdfReference = () => {
    this.components.sidePageReferenceContainer.className = "no-width";
    this.pdfContainer.className = "full-width";
    if (
      this.main == this.components.closeBtnReference.parentElement
    ) {
      this.main.removeChild(this.components.closeBtnReference);
    }
  };

  /**
   * Handler to display the reference page.
   * @private
   */
  #showPdfReference = () => {
    this.pdfContainer.className = "half-width";
    this.components.closeBtnReference.setAttribute("id", "close-btn-reference");
    this.components.closeBtnReference.innerHTML = "<a>&times;</a>";
    this.main.appendChild(this.components.sidePageReferenceContainer);
    this.main.appendChild(this.components.closeBtnReference);
    this.components.closeBtnReference.className += " moveIn";
    this.components.sidePageReferenceContainer.className += " moveIn";
  };

  /**
   * Call back to renders the reference page.
   * @private
   */
  #renderPdfReference = (pageNumber) => {
    this.components.sideNav.className = "no-width";
    this.components.sidePageReferenceContainer.setAttribute("id", "side-page-reference-container");

    if (this.pdfDoc === null) {
      throw new Error("PDFDocument object missed");
    }

    textRenderService.renderPageReference(
      this.pdfDoc,
      this.components,
      pageNumber
    );
    
  };

}

export { ReferenceViewComponent };
