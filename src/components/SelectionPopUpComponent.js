import { getCurrentDOMSelection, isChildOf } from "../services/Utils";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { POPUP_DISAPPEAR_TIMEOUT } from "../Constants";

/**
 * Class to display a popup when a text is selected
 * @property {HTMLElement} components.popupSelectedText container for the popup
 * @property {HTMLElement} components.summarySelectedTextBtn button to open the summary of the selected text
 */
class SelectionPopUpComponent {
  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    popupSelectedText: document.querySelector("#pop-up-selection"),
    summarySelectedTextBtn: document.querySelector("#summary-selection"),
  };

  /**
   * @constructor
   * Register needed events
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * @private
   * Register mouseup and mousedown event to manage selection
   */
  #registerEvents = () => {
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));

    this.components.summarySelectedTextBtn.addEventListener(
      "click",
      this.#showSummaryKey
    );
  };

  /**
   * On mouse up callback check if action duration is bigger then threshold
   * to distinguish a click action from a selection one
   * @param event
   */
  #onMouseUp = (event) => {
    this.#handleSelection(
      {
        x: event.clientX + window.scrollX,
        y: event.clientY + window.scrollY,
      },
      event.target
    );
  };

  /**
   * Selection handling function to get the selected text if exists and display the popup
   * @param position last mouse action position
   * @param {HTMLElement} eventTarget the target of the action
   */
  #handleSelection = (position, eventTarget) => {
    let component = this.components;
    const selectedText = getCurrentDOMSelection().trim();
    if (
      selectedText !== "" &&
      isChildOf(this.components.pdfContainer, eventTarget)
    ) {
      clearTimeout(hidePopupTimeout);
      component.popupSelectedText.classList.remove("hidden");
      component.popupSelectedText.style.top = position.y + "px";
      component.popupSelectedText.style.left = position.x + 20 + "px";
      EventHandlerService.publish(
        PDFLEvents.onTextSelectionReady,
        selectedText
      );
    }

    /* Hide the popup events */
    const hidePopupTimeout = setTimeout(() => {
      this.#hidePopup();
    }, POPUP_DISAPPEAR_TIMEOUT);
    component.popupSelectedText.addEventListener("mouseenter", (event) => {
      event.preventDefault();
      component.popupSelectedText.classList.remove("hidden");
      clearTimeout(hidePopupTimeout);
    });
    component.popupSelectedText.addEventListener("mouseleave", (event) => {
      event.preventDefault();
      component.popupSelectedText.classList.add("hidden");
    });
    document
      .querySelector("#pdf-container")
      .addEventListener("mouseleave", (event) => {
        event.preventDefault();
        this.#hidePopup();
      });
  };

  /**
   * Triggers event on which Summary Key will be shown.
   * @private
   */
  #showSummaryKey = () => {
    EventHandlerService.publish(PDFLEvents.onShowSummaryKey);
    this.components.popupSelectedText.classList.add("hidden");
  };

  /**
   * Handler to hides the popup
   * @private
   */
  #hidePopup = () => {
    this.components.popupSelectedText.classList.add("hidden");
  };
}

export { SelectionPopUpComponent };
