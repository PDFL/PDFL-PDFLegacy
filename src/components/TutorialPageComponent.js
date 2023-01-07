import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

/**
 * Component that takes in the PDF file that user uploads and processes it.
 *
 * @property {Object} components object that holds DOM elements that are within component
 */
class TutorialPageComponent {
  components = {
    tutorialPage: document.querySelector("#tutorial-page"),
    backBtn: document.querySelector("#back-btn"),
  };

  /**
   * Creates and initializes navbar component.
   * @constructor
   */
  constructor() {
    this.#registerEvents();
    EventHandlerService.subscribe(PDFLEvents.onShowTutorialView, () => {
      this.#showTutorialView();
    });
  }

  /**
   * Adds event listeners to new pdf button
   * @private
   */
  #registerEvents = () => {
    this.components.backBtn.addEventListener("click", this.#showLastView);
  };

  #showLastView = () => {
    document.querySelector("#pdf-viewer").classList.remove("hidden");
    this.components.tutorialPage.classList.add("hidden");
  };

  #showTutorialView = () => {
    document.querySelector("#pdf-viewer").classList.add("hidden");
    this.components.tutorialPage.classList.remove("hidden");
  };
}

export { TutorialPageComponent };
