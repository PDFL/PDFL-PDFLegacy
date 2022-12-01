import { EventHandlerService, PDFLEvents } from "./EventHandlerService";

/**
 * This Service is used to add a global document listener on keyboards events.
 *
 */
class KeyboardService {
  /**
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * @private
   * This function registers the DOM event for keyboard keyup
   */
  #registerEvents = () => {
    document.addEventListener("keyup", this.#onKeyUp);
    document.addEventListener("keydown", this.#onKeyDown);
    document.addEventListener("keypress", this.#onKeyPress);
  };

  /**
   * @private
   * Callback function for the keyUp event
   * Looks at the key which has been released and dispatch the event on the EventHandler
   * @param event the event of the callback
   */
  #onKeyUp = (event) => {
    const key = event.which || event.keyCode;
    const functionalKeys = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
    };
    EventHandlerService.publish(
      PDFLEvents.onKeyboardKeyUp,
      functionalKeys,
      key
    );
  };
  /**
   * @private
   * Callback function for the keyDown event
   * Looks at the key which has been released and dispatch the event on the EventHandler
   * @param event the event of the callback
   */
  #onKeyDown = (event) => {
    const key = event.which || event.keyCode;
    const functionalKeys = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
    };
    EventHandlerService.publish(
      PDFLEvents.onKeyboardKeyDown,
      functionalKeys,
      key
    );
  };
  /**
   * @private
   * Callback function for the keyPress event
   * Looks at the key which has been released and dispatch the event on the EventHandler
   * @param event the event of the callback
   */
  #onKeyPress = (event) => {
    const key = event.which || event.keyCode;
    const functionalKeys = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
    };
    EventHandlerService.publish(
      PDFLEvents.onKeyboardKeyPress,
      functionalKeys,
      key
    );
  };
}

export { KeyboardService };
