import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

/**
 * Component that takes in the PDF file that user uploads and processes it.
 *
 * @property {Object} components object that holds DOM elements that are within component
 */
class DocumentationComponent {
  components = {
    homeBtn: document.querySelector("#home-btn"),
  };

  /**
   * Creates and initializes navbar component.
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * Adds event listeners to new pdf button
   * @private
   */
  #registerEvents = () => {
    this.components.homeBtn.addEventListener("click", this.#showWelcomeView);
  };

  #showWelcomeView = () => {
    EventHandlerService.publish(PDFLEvents.onShowWelcomeView);
  };
}

export { DocumentationComponent };
