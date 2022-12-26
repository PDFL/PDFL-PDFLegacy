import { MOUSE_MIN_SELECTION_TIME } from "../Constants";
import { getCurrentDOMSelection } from "../services/Utils";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

class SelectionPopUpComponent {
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
    const selectedText = getCurrentDOMSelection().trim();
    if (selectedText !== "") {
      //TODO:- PopUp here -> On button dispatch the event to display summary
      EventHandlerService.publish(
        PDFLEvents.onTextSelectionReady,
        selectedText
      );
    }
  };
}

export { SelectionPopUpComponent };
