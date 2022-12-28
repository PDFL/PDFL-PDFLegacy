import { MOUSE_MIN_SELECTION_TIME } from "../Constants";
import { getCurrentDOMSelection } from "../services/Utils";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { POPUP_DISAPPEAR_TIMEOUT } from "../Constants";

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
    this.mouseDownTime = null;
  }

  /**
   * @private
   * Register mouseup and mousedown event to manage selection
   */
  #registerEvents = () => {
    document.addEventListener("mousedown", this.#onMouseDown.bind(this));
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));

    this.components.summarySelectedTextBtn.addEventListener(
      "click",
      this.#showSummaryKey
    );
  };

  /**
   * On mouse down callback, set action time
   * @param event
   */
  #onMouseDown = (event) => {
    this.mouseDownTime = new Date().getTime();
  };

  /**
   * On mouse up callback check if action duration is bigger then threshold
   * to distinguish a click action from a selection one
   * @param event
   */
  #onMouseUp = (event) => {
    var mouseUpTime = new Date().getTime();
    if (mouseUpTime - this.mouseDownTime > MOUSE_MIN_SELECTION_TIME) {
      this.#handleSelection({
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  /**
   * Selection handling function
   * Get selected text
   * If a text exists diplasy the popup to generate summary
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
      this.hidePopup();
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
        this.hidePopup();
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
  hidePopup = () => {
    this.components.popupSelectedText.classList.add("hidden");
  };
}

export { SelectionPopUpComponent };
