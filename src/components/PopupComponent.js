import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

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
 */
class PopupComponent {
  components = {
    popupDiv: document.createElement("div"),
    pdfContainer: document.querySelector("#pdf-container"),
    contentDiv: document.createElement("div"),
    content: document.createElement("p"),
    sidePageReferenceBtn: document.createElement("button"),
    pageNumber: null,
  };

  /**
   * Creates the handler service for managing the reference object
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  #registerEvents = () => {
    EventHandlerService.subscribe(
      PDFLEvents.onPopupContentReady,
      this.#onPopupContentReady.bind(this)
    );

    this.components.sidePageReferenceBtn.addEventListener(
      "click",
      this.#openPdfReference.bind(this)
    );
  };

  #openPdfReference = (event) => {
    this.components.contentDiv.removeChild(
      this.components.sidePageReferenceBtn
    );
    event.preventDefault();
    const pageNumber = this.components.pageNumber;
    EventHandlerService.publish(PDFLEvents.onReferencePdfOpen, pageNumber);
  };

  /**
   * Call back to show the pop up and its elements
   * @private
   */
  #onPopupContentReady = (position, pageNumber, contentObject) => {
    this.components.pageNumber = pageNumber;
    this.components.popupDiv.setAttribute("id", "pop-up");
    this.components.contentDiv.setAttribute("id", "content-reference-div");
    this.components.content.setAttribute("id", "pop-up-content");
    this.components.sidePageReferenceBtn.setAttribute("class", "btn");
    this.components.sidePageReferenceBtn.setAttribute(
      "id",
      "side-page-reference-btn"
    );

    this.components.popupDiv.style.top = position.y + "px";
    this.components.popupDiv.style.left = position.x + 10 + "px";
    this.components.sidePageReferenceBtn.innerHTML =
      '<a><i class="material-icons" id="open-in-the-side-icon">open_in_new</i></a>';

    this.components.pdfContainer.appendChild(this.components.popupDiv);
    this.components.popupDiv.appendChild(this.components.contentDiv);
    this.components.contentDiv.appendChild(this.components.content);
    this.components.contentDiv.appendChild(
      this.components.sidePageReferenceBtn
    );
    setTimeout(this.hidePopup, POPUP_DISAPPEAR_TIMEOUT);
  };

  hidePopup = () => {
    this.components.pdfContainer.removeChild(this.components.popupDiv);
  };
}

export { PopupComponent };
