import { getCurrentDOMSelection } from "../services/Utils";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { POPUP_DISAPPEAR_TIMEOUT } from "../Constants";

/**
 * Class to display a popup when a text is selected
 * @property {HTMLElement} components.popupSelectedText
 * @property {HTMLElement} components.summarySelectedTextBtn
 */
class SelectionPopUpComponent {
  components = {
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
    this.#handleSelection({
      x: event.clientX + window.scrollX,
      y: event.clientY + window.scrollY,
    });
  };

  /**
   * Selection handling function to get the selected text if exists and display the popup
   * @param position last mouse action position
   */
  #handleSelection = (position) => {
    let component = this.components;
    const selectedText = getCurrentDOMSelection().trim();
    if (selectedText !== "") {
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
      this.components.popupSelectedText.classList.remove("hidden");
      clearTimeout(hidePopupTimeout);
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
