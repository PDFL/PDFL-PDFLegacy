import { AppView } from "./AppView.js";
/**
 * Tutorial Page View
 *
 * @extends AppView
 * @property {HTMLElement} component DOM element representing the tutorial page view
 * @property {HTMLElement} components.tutorialPage div that contains the tutorial page
 * @property {HTMLElement} components.backBtn button that let the user come back to last opened view
 */
class TutorialPageView extends AppView {
  components = {
    view: document.getElementById("tutorial-page"),
    backBtn: document.querySelector("#back-btn"),
  };

  /**
   * Initializes tutorial page view
   */
  init() {
    this.#registerEvents();
    this.components.view.hidden = false;
    document.querySelector("#pdf-viewer").classList.add("hidden");
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
    window.scroll({
      top: 40,
      left: 0,
      behavior: "smooth",
    });
    this.components.view.hidden = true;
    document.querySelector("#pdf-viewer").classList.remove("hidden");
  };
}

export { TutorialPageView };
