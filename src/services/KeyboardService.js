import { EventHandlerService, PDFLEvents } from "./EventHandlerService";
import {PreventOnKeyDown, PreventOnKeyPress, PreventOnKeyUp} from "../DisabledDefaultKeyboardShortcuts";

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
    PreventOnKeyUp.forEach(prevent => {
      if(functionalKeys.ctrl === prevent.ctrl && functionalKeys.alt === prevent.alt && functionalKeys.shift === prevent.shift && key === prevent.key){
        event.preventDefault();
      }
    });
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
    PreventOnKeyDown.forEach(prevent => {
      if(functionalKeys.ctrl === prevent.ctrl && functionalKeys.alt === prevent.alt && functionalKeys.shift === prevent.shift && key === prevent.key){
        event.preventDefault();
      }
    });
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
    PreventOnKeyPress.forEach(prevent => {
      if(functionalKeys.ctrl === prevent.ctrl && functionalKeys.alt === prevent.alt && functionalKeys.shift === prevent.shift && key === prevent.key){
        event.preventDefault();
      }
    });
    EventHandlerService.publish(
      PDFLEvents.onKeyboardKeyPress,
      functionalKeys,
      key
    );
  };
}

export { KeyboardService };
