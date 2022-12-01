import { EventHandlerService, PDFLEvents } from "./EventHandlerService";
import {
  PreventOnKeyDown,
  PreventOnKeyPress,
  PreventOnKeyUp,
} from "../DisabledDefaultKeyboardShortcuts";

/**
 * This Service is used to add a global document listener on keyboards events.
 * All actions performed with CTRL (Control) key in macOS are overridden with CMD (Command)
 * The result of a keyboard action is a publish in the EventHandlerService with two parameters:
 *  - functionalKeys: object containing three booleans representing if ctrl(cmd), alt and shift are pressed
 *  - key: the actual key pressed
 * To add a keyboard action just check the key value needed and the three functional keys state subscribing the corresponding event.
 * In addition, it is possible to prevent a specific default action leaving the other possible
 * @see {PreventOnKeyDown, PreventOnKeyPress, PreventOnKeyUp} to disable a default keyboard shortcut.
 *
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
    const functionalKeys = this.#buildFunctionalKeysObject(event);
    PreventOnKeyUp.forEach((prevent) => {
      if (
        functionalKeys.ctrl === prevent.ctrl &&
        functionalKeys.alt === prevent.alt &&
        functionalKeys.shift === prevent.shift &&
        key === prevent.key
      ) {
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
    const functionalKeys = this.#buildFunctionalKeysObject(event);
    PreventOnKeyDown.forEach((prevent) => {
      if (
        functionalKeys.ctrl === prevent.ctrl &&
        functionalKeys.alt === prevent.alt &&
        functionalKeys.shift === prevent.shift &&
        key === prevent.key
      ) {
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
    const functionalKeys = this.#buildFunctionalKeysObject(event);
    PreventOnKeyPress.forEach((prevent) => {
      if (
        functionalKeys.ctrl === prevent.ctrl &&
        functionalKeys.alt === prevent.alt &&
        functionalKeys.shift === prevent.shift &&
        key === prevent.key
      ) {
        event.preventDefault();
      }
    });
    EventHandlerService.publish(
      PDFLEvents.onKeyboardKeyPress,
      functionalKeys,
      key
    );
  };

  /**
   * Helper function to build the functional key state object
   * @param event the keyboard event
   * @returns {{ctrl: boolean, shift: boolean, alt: boolean}} the representation of the state of the functional keys
   */
  #buildFunctionalKeysObject = (event) => {
    return {
      ctrl: this.isMac ? event.metaKey : event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
    };
  };
}

export { KeyboardService };
