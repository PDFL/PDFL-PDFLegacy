import {
  EventHandlerService,
  PDFLEvents,
} from "../../../services/EventHandlerService.js";
import { AppView } from "./AppView.js";
/**
 * Tutorial Page View
 *
 * @extends AppView
 * @property {HTMLElement} component DOM element representing the file upload view
 * @property {HTMLElement} components.tutorialPage div that contains the tutorial page
 * @property {HTMLElement} components.backBtn button that let the user come back to last opened view
 */
class TutorialPageView extends AppView {
  components = {
    view: document.getElementById("tutorial-page"),
    backBtn: document.querySelector("#back-btn"),
  };

  /**
   * Initializes welcome page view - shows current view and hides others.
   */
  init() {
    this.#registerEvents();
    this.components.view.hidden = false;
  }

  /**
   * Adds event listeners to back button
   * @private
   */
  #registerEvents = () => {
    this.components.backBtn.addEventListener("click", this.#showLastView);
    EventHandlerService.subscribe(PDFLEvents.onShowTutorialView, () => {
      this.#showTutorialView();
    });
  };

  /**
   * Hides tutorial page to show last view opened
   *
   * @private
   */
  #showLastView = () => {
    document.querySelector("#pdf-viewer").classList.remove("hidden");
    this.components.view.hidden = true;
  };

  /**
   * Shows tutorial page
   *
   * @private
   */
  #showTutorialView = () => {
    document.querySelector("#pdf-viewer").classList.add("hidden");
  };
}

export { TutorialPageView };
