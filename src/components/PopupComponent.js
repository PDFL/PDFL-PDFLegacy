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
 * @property {HTMLElement} components.pdfContainer element containing the PDF reader
 * @property {HTMLElement} components.popupDiv div that contain the reference
 * @property {HTMLElement} components.sidePageReferenceBtn button that open the two page layout view
 * @property {HTMLElement} components.contentDiv div containing the content of the reference img/table/text/pdf
 * @property {HTMLElement} components.title title of the reference selected
 * @property {HTMLElement} components.hr hr to separate title from text
 * @property {HTMLElement} components.text the text of the reference
 * @property {HTMLElement} components.image container for the image of the referenct
 * @property {int} components.pageNumber parser for the number of the page of the reference
 */
class PopupComponent {
  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    popupDiv: document.querySelector("#pop-up"),
    sidePageReferenceBtn: document.querySelector("#side-page-reference-btn"),
    contentDiv: document.querySelector("#content-reference-div"),
    title: document.querySelector("#pop-up-title"),
    hr: document.querySelector("#hr-pop-up"),
    text: document.querySelector("#pop-up-text"),
    image: document.querySelector("#pop-up-image"),
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
    this.hidePopup();
    event.preventDefault();
    const pageNumber = this.components.pageNumber;
    EventHandlerService.publish(PDFLEvents.onReferencePdfOpen, pageNumber);
  };

  /**
   * Call back to show the pop up and its elements
   * @private
   * @param {int} position position of the reference x,y
   * @param {int} pageNumber number of the page of the reference
   * @param {Object} contentObject object of the reference containing type and text/image of it
   */
  #onPopupContentReady = (position, pageNumber, contentObject) => {
    let component = this.components;
    component.popupDiv.classList.remove("hidden");
    component.contentDiv.classList.remove("hidden");
    component.pageNumber = pageNumber;
    component.popupDiv.style.top = position.y + "px";
    component.popupDiv.style.left = position.x + 20 + "px";

    console.log("test");

    /* Switch element to display according to reference type*/
    switch (contentObject.type) {
      case "text":
        component.image.classList.add("hidden");
        component.title.classList.remove("hidden");
        component.text.classList.remove("hidden");
        component.hr.classList.remove("hidden");
        component.title.innerHTML = contentObject.title;
        component.text.innerHTML = contentObject.text;
        break;
      case "image":
        component.title.classList.add("hidden");
        component.text.classList.add("hidden");
        component.hr.classList.add("hidden");
        component.image.classList.remove("hidden");
        component.image.innerHTML =
          "<img src='" + contentObject.src + "' id='image-pop-up'/>";
        break;
      case "page":
        component.contentDiv.classList.add("hidden");
        break;
      default:
        component.popupDiv.classList.add("hidden");
        component.pdfContainer.style.cursor = "default";
    }

    const hidePopupTimeout = setTimeout(() => {
      this.hidePopup();
    }, POPUP_DISAPPEAR_TIMEOUT);
    component.popupDiv.addEventListener("mouseenter", (event) => {
      event.preventDefault();
      this.components.popupDiv.classList.remove("hidden");
      clearTimeout(hidePopupTimeout);
    });
    component.popupDiv.addEventListener("mouseleave", (event) => {
      event.preventDefault();
      setTimeout(() => {
        this.hidePopup();
      }, POPUP_DISAPPEAR_TIMEOUT);
    });
    document
      .querySelector("#pdf-container")
      .addEventListener("mouseleave", (event) => {
        event.preventDefault();
        this.hidePopup();
      });
  };

  /**
   * Handler to hides the popup
   * @private
   */
  hidePopup = () => {
    this.components.popupDiv.classList.add("hidden");
  };
}

export { PopupComponent };
