import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

const pdfjsLib = require("pdfjs-dist");
import { POPUP_DISAPPEAR_TIMEOUT } from "../Constants";

/**
 * Component representing pop up for every reference and display dynamically the content of it
 *
 *
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.popupDiv div that contain the reference
 * @property {HTMLElement} components.pdfContainer element containing the PDF reader
 * @property {HTMLElement} components.contentDiv div containing the content of the reference img/table/text/pdf
 * @property {HTMLElement} components.content the content of the reference img/table/text/pdf
 * @property {HTMLElement} components.sidePageReferenceBtn button that open the two page layout view
 * @property {HTMLElement} components.sidePageReferenceDiv div for the refrence
 * @property {HTMLElement} components.sidePageReferenceContainer canvas for the pdf reference
 * @property {HTMLElement} components.main button that oipen the two page layout view
 * @property {HTMLElement} components.pdfDoc pdf of the user
 * @property {HTMLElement} components.pdfPageNumber number of the page of the reference
 * @property {HTMLElement} components.viewport handle the viewport
 * @property {HTMLElement} components.graphMakerBtn button that generates knowledge graph to manage the request
 * of knowledge graph display when pdf reference is displayed
 * @property {HTMLElement} components.sideNav div that contain the graph
 * @property {HTMLElement} components.closeBtnReference button for close the reference page
 */
class PopupComponent {
  components = {
    popupDiv: document.createElement("div"),
    pdfContainer: document.querySelector("#pdf-container"),
    contentDiv: document.createElement("div"),
    content: document.createElement("p"),
    sidePageReferenceBtn: document.createElement("button"),
    sidePageReferenceDiv: document.createElement("div"),
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
   * Creates the handler service for managing the reference object
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
      PDFLEvents.onPopupContentReady,
      this.#onPopupContentReady.bind(this)
    );

    this.components.sidePageReferenceBtn.addEventListener(
      "click",
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
  #displayPdfReference = () => {
    this.components.sidePageReferenceDiv.setAttribute(
      "id",
      "side-page-reference-div"
    );
    this.components.main.appendChild(this.components.sidePageReferenceDiv);
    this.#renderPdfReference();
    this.#showPdfReference();
  };

  /**
   * Cretes event triggered when graoh maker button is clicked to hide the reference pdf to show the graph
   * @private
   */
  #hidePdfReferenceToShowGraph = () => {
    this.components.sidePageReferenceDiv.className = "no-width";
    this.components.sidePageReferenceDiv.removeChild(
      this.components.closeBtnReference
    );
  };

  /**
   * Cretes event triggered when graoh maker button is clicked to hide the reference pdf and show the
   * main pdf in full width
   * @private
   */
  #hidePdfReference = () => {
    this.components.sidePageReferenceDiv.className = "no-width";
    this.components.pdfContainer.className = "full-width";
    this.components.sidePageReferenceDiv.removeChild(
      this.components.closeBtnReference
    );
  };

  /**
   * Call back to display the reference page.
   * @private
   */
  #showPdfReference = () => {
    this.components.sidePageReferenceDiv.className = "half-width";
    this.components.closeBtnReference.setAttribute("id", "close-btn-reference");
    this.components.closeBtnReference.innerHTML = "<a>&times;</a>";
    this.components.contentDiv.removeChild(
      this.components.sidePageReferenceBtn
    );
    this.components.sidePageReferenceDiv.appendChild(
      this.components.sidePageReferenceContainer
    );
    this.components.sidePageReferenceDiv.appendChild(
      this.components.closeBtnReference
    );
    this.components.closeBtnReference.className += " moveIn";
    this.components.sidePageReferenceContainer.className += " moveIn";
  };

  /**
   * Call back to renders the reference page with textLayout
   * @private
   */
  #renderPdfReference = () => {
    const component = this.components;
    component.sideNav.className = "no-width";
    component.sidePageReferenceContainer.setAttribute(
      "id",
      "side-page-reference-container"
    );
    component.sidePageReferenceContainer.setAttribute(
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
          component.sidePageReferenceContainer.getContext("2d");
        component.viewport = page.getViewport({
          scale: 1,
        });

        component.sidePageReferenceContainer.height = component.viewport.height;
        component.sidePageReferenceContainer.width = component.viewport.width;

        const renderCtx = {
          canvasContext: ctxReference,
          viewport: component.viewport,
        };
        page.render(renderCtx);
        /* Text Layer Implementation */
        const textLayer = document.createElement("div");
        textLayer.setAttribute("class", "textLayer");
        textLayer.setAttribute("id", "text-layer-reference");

        page.getTextContent().then(function (textContent) {
          textLayer.style.left =
            component.sidePageReferenceContainer.offsetLeft + "px";
          textLayer.style.top =
            component.sidePageReferenceContainer.offsetTop + "px";
          textLayer.style.height =
            component.sidePageReferenceContainer.offsetHeight + "px";
          textLayer.style.width =
            component.sidePageReferenceContainer.offsetWidth + "px";

          // idea principale mettere tutto dentro renderCTX

          //Render the text inside the textLayer container
          pdfjsLib.renderTextLayer({
            textContent: textContent,
            container: textLayer,
            viewport: component.viewport,
            textDivs: [],
          });
        });
        component.sidePageReferenceDiv.appendChild(textLayer);
      })
      .catch((err) => {
        console.log(err.message); // TODO: handle error in some way
      });
  };

  /**
   * Call back to show the pop up and its elements
   * @private
   */
  #onPopupContentReady = (position, pageNumber, contentObject) => {
    this.components.pdfPageNumber = pageNumber;
    this.components.popupDiv.setAttribute("id", "pop-up");
    this.components.contentDiv.setAttribute("id", "content-reference-div");
    this.components.content.setAttribute("id", "pop-up-content");
    this.components.sidePageReferenceBtn.setAttribute("class", "btn");
    this.components.sidePageReferenceBtn.setAttribute(
      "id",
      "side-page-reference-btn"
    );

    this.components.popupDiv.style.top = position.y + "px";
    this.components.popupDiv.style.left = position.x + 15 + "px";
    this.components.sidePageReferenceBtn.innerHTML =
      '<a><i class="material-icons" id="open-in-the-side-icon">open_in_new</i></a>';

    this.components.pdfContainer.appendChild(this.components.popupDiv);
    this.components.popupDiv.appendChild(this.components.contentDiv);
    this.components.contentDiv.appendChild(this.components.content);
    this.components.contentDiv.appendChild(
      this.components.sidePageReferenceBtn
    );
    setTimeout(this.hidePopup, 3000); //after 3 second the popup disappears
  };

  hidePopup = () => {
    this.components.pdfContainer.removeChild(this.components.popupDiv);
  };
}

export { PopupComponent };
