import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

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
 * @property {HTMLElement} components.pdfDoc pdf of the user
 * @property {HTMLElement} components.pdfPageNumber number of the page of the reference
 * @property {HTMLElement} components.viewport handle the viewport
 * @property {HTMLElement} components.graphMakerBtn button that generates knowledge graph to manage the request
 * of knowledge graph display when pdf reference is displayed
 * @property {HTMLElement} components.sideNav div that contain the graph
 * @property {HTMLElement} components.closeBtnReference button for close the reference page
 */

class ReferenceViewComponent {
  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    contentDiv: document.querySelector("#content-reference-div"),
    sidePageReferenceBtn: document.querySelector("#side-page-reference-btn"),
    sidePageReferenceContainer: document.createElement("canvas"),
    main: document.querySelector("#main"),
    pdfDoc: null,
    pdfPageNumber: null,
    viewport: null,
    graphMakerBtn: document.querySelector("#graph-maker"),
    sideNav: document.querySelector("#side-page"),
    closeBtnReference: document.createElement("button"),
  };

  /**
   * Creates the endler service for manage the reference object
   * @constructor
   */
  constructor() {
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
    this.components.graphMakerBtn.addEventListener(
      "click",
      this.#hidePdfReferenceToShowGraph.bind(this)
    );
    this.components.closeBtnReference.addEventListener(
      "click",
      this.#hidePdfReference.bind(this)
    );
  };

  /**
   * Cretes event triggered when two page layout button is clicked
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
    this.components.main.removeChild(this.components.closeBtnReference);
  };

  /**
   * Cretes event triggered when graoh maker button is clicked to hide the reference pdf and show the
   * main pdf in full width
   * @private
   */
  #hidePdfReference = () => {
    this.components.sidePageReferenceContainer.className = "no-width";
    this.components.pdfContainer.className = "full-width";
    this.components.main.removeChild(this.components.closeBtnReference);
  };

  /**
   * Handler to display the reference page.
   * @private
   */
  #showPdfReference = () => {
    this.components.pdfContainer.className = "half-width";
    this.components.closeBtnReference.setAttribute("id", "close-btn-reference");
    this.components.closeBtnReference.innerHTML = "<a>&times;</a>";
    this.components.main.appendChild(
      this.components.sidePageReferenceContainer
    );
    this.components.main.appendChild(this.components.closeBtnReference);
    this.components.closeBtnReference.className += " moveIn";
    this.components.sidePageReferenceContainer.className += " moveIn";
  };

  /**
   * Call back to renders the reference page.
   * @private
   */
  #renderPdfReference = (pageNumber) => {
    this.components.pdfPageNumber = pageNumber;
    console.log(this.components.pdfPageNumber);
    this.components.sideNav.className = "no-width";
    this.components.sidePageReferenceContainer.setAttribute(
      "id",
      "side-page-reference-container"
    );
    this.components.sidePageReferenceContainer.setAttribute(
      "class",
      "canvas__container"
    );

    if (this.pdfDoc === null) {
      throw new Error("PDFDocument object missed");
    }
    this.pdfDoc
      .getPage(this.components.pdfPageNumber)
      .then((page) => {
        const ctxReference =
          this.components.sidePageReferenceContainer.getContext("2d");
        this.components.viewport = page.getViewport({
          scale: 1,
        });

        this.components.sidePageReferenceContainer.height =
          this.components.viewport.height;
        this.components.sidePageReferenceContainer.width =
          this.components.viewport.width;

        const renderCtx = {
          canvasContext: ctxReference,
          viewport: this.components.viewport,
        };
        page.render(renderCtx);
      })
      .catch((err) => {
        console.log(err.message); // TODO: handle error in some way
      });
  };
}

export { ReferenceViewComponent };
