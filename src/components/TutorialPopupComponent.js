/**
 * Component representing pop up for every reference and display dynamically the content of it
 *
 *
 * @property {Object} components object that holds DOM elements that represent tutorial popup component and his own objects
 * @property {HTMLElement} components.questionMarkHighlight question mark for highlight feature tutorial
 * @property {HTMLElement} components.questionMarkGraph question mark for graph feature tutorial
 * @property {HTMLElement} components.questionMarkSummary question mark for summary feature tutorial
 * @property {HTMLElement} components.panelTutorial div that contains the tutorial window
 * @property {HTMLElement} components.highlightTutorialWindow card with higlight tutorial gif and text
 * @property {HTMLElement} components.graphTutorialWindow card with knowledge graph tutorial gif and text
 * @property {HTMLElement} components.summaryTutorialWindow card with summary tutorial gif and text
 */
class TutorialPopupComponent {
  components = {
    questionMarkHighlight: document.querySelector("#tutorial-highlight"),
    questionMarkGraph: document.querySelector("#tutorial-graph"),
    questionMarkSummary: document.querySelector("#tutorial-summary"),
    panelTutorial: document.querySelector("#tutorial"),
    highlightTutorialWindow: document.querySelector(
      "#highlight-tutorial-window"
    ),
    graphTutorialWindow: document.querySelector("#graph-tutorial-window"),
    summaryTutorialWindow: document.querySelector("#summary-tutorial-window"),
  };

  /**
   * Creates the handler service for managing the reference object
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  #registerEvents = () => {
    this.components.questionMarkHighlight.addEventListener(
      "mouseenter",
      (event) => {
        event.preventDefault();
        this.#showTutorialWindow("highlight");
      }
    );
    this.components.questionMarkHighlight.addEventListener(
      "mouseleave",
      (event) => {
        event.preventDefault();
        this.#hideTutorialWindow();
      }
    );
    this.components.questionMarkGraph.addEventListener(
      "mouseenter",
      (event) => {
        event.preventDefault();
        this.#showTutorialWindow("graph");
      }
    );
    this.components.questionMarkGraph.addEventListener(
      "mouseleave",
      (event) => {
        event.preventDefault();
        this.#hideTutorialWindow();
      }
    );
    this.components.questionMarkSummary.addEventListener(
      "mouseenter",
      (event) => {
        event.preventDefault();
        this.#showTutorialWindow("summary");
      }
    );
    this.components.questionMarkSummary.addEventListener(
      "mouseleave",
      (event) => {
        event.preventDefault();
        this.#hideTutorialWindow();
      }
    );
  };

  #showTutorialWindow = (element) => {
    this.#showPopup();
    /* Switch element to display tutorial in accordion to feature */
    switch (element) {
      case "highlight":
        this.components.highlightTutorialWindow.classList.remove("hidden");
        break;
      case "graph":
        this.#showPopup();
        this.components.graphTutorialWindow.classList.remove("hidden");
        break;
      case "summary":
        this.components.summaryTutorialWindow.classList.remove("hidden");
        break;
      default:
        this.#hideTutorialWindow();
    }
  };

  /**
   * Handler to display the tutorial window
   * @private
   */
  #showPopup = () => {
    this.components.panelTutorial.style = "display:flex";
  };

  /**
   * Handler to hides the tutorial window
   * @private
   */
  #hideTutorialWindow = () => {
    this.components.panelTutorial.style = "display:none";
    this.components.highlightTutorialWindow.classList.add("hidden");
    this.components.graphTutorialWindow.classList.add("hidden");
    this.components.summaryTutorialWindow.classList.add("hidden");
  };
}

export { TutorialPopupComponent };
