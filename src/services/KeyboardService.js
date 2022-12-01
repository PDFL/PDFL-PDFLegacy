import { EventHandlerService, PDFLEvents } from "./EventHandlerService";

/**
 * This Service is used to add a global document listener on keyboards events.
 * @property {boolean} isMac true if the running system is macOS. used to bind cmd instead of ctrl
 */
class KeyboardService {
  /**
   * @constructor
   */
  constructor() {
    this.#registerEvents();
    this.isMac =
      (navigator?.userAgentData?.platform || navigator?.platform)
        .toLowerCase()
        .indexOf("mac") === 0;
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
      ctrl: this.isMac ? event.metaKey : event.ctrlKey,
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
      ctrl: this.isMac ? event.metaKey : event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
    };
    if(functionalKeys.ctrl && (key === 187|| key === 189)){
      event.preventDefault();
    }
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
    if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) {
      return;
    }
    const key = event.which || event.keyCode;
    const functionalKeys = {
      ctrl: this.isMac ? event.metaKey : event.ctrlKey,
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
