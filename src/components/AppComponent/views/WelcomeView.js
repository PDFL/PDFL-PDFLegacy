import { AppView } from "./AppView.js";
import {
  EventHandlerService,
  PDFLEvents,
} from "../../../services/EventHandlerService.js";

/**
 * Welcome page view.
 *
 * @extends AppView
 * @property {Object} components object that holds DOM elements that are within view
 * @property {HTMLElement} components.view element that represents welcome view
 * @property {HTMLElement} components.buttonFile button that takes user to file input page
 */
class WelcomeView extends AppView {
  components = {
    view: document.getElementById("welcome-page"),
    buttonFile: document.getElementById("button-file"),
  };

  /**
   * Initializes welcome page view - shows current view and hides others.
   */
  init() {
    this.cleanView();
    this.components.view.hidden = false;
    this.#registerEvents();
  }

  /**
   * Add event listeners for welcome view
   * @private
   */
  #registerEvents = () => {
    this.components.buttonFile.addEventListener("click", this.#changeView);
  };

  /**
   * Function for button listener to change view
   * @private
   */
  #changeView = () => {
    EventHandlerService.publish(PDFLEvents.onShowInputView);
  };
}

export { WelcomeView };
