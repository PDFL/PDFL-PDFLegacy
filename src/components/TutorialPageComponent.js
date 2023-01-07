import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

/**
 * Component that takes Tutorial Page View and it's component
 *
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.tutorialPage div that contains the tutorial page
 * @property {HTMLElement} components.backBtn button that let the user come back to last opened view
 */
class TutorialPageComponent {
  components = {
    tutorialPage: document.querySelector("#tutorial-page"),
    backBtn: document.querySelector("#back-btn"),
  };

  /**
   * Creates and initializes tutorial page component.
   * @constructor
   */
  constructor() {
    this.#registerEvents();
    EventHandlerService.subscribe(PDFLEvents.onShowTutorialView, () => {
      this.#showTutorialView();
    });
  }

  /**
   * Adds event listeners to back button
   * @private
   */
  #registerEvents = () => {
    this.components.backBtn.addEventListener("click", this.#showLastView);
  };

  /**
   * Hides tutorial page to show last view opened
   *
   * @private
   */
  #showLastView = () => {
    document.querySelector("#pdf-viewer").classList.remove("hidden");
    this.components.tutorialPage.classList.add("hidden");
  };

  /**
   * Shows tutorial page
   *
   * @private
   */
  #showTutorialView = () => {
    document.querySelector("#pdf-viewer").classList.add("hidden");
    this.components.tutorialPage.classList.remove("hidden");
  };
}

export { TutorialPageComponent };
