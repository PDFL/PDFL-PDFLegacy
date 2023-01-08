import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
/**
 * Component representing tutorial window component and it's element to display highlight, graph and summary window tutorial
 *
 * @property {Object} components object that holds DOM elements that represent tutorial popup component and it's own objects
 * @property {HTMLElement} components.panelTutorial div that contains the tutorial window
 * @property {HTMLElement} components.highlightTutorialWindow card with higlight tutorial gif and text
 * @property {HTMLElement} components.graphTutorialWindow card with knowledge graph tutorial gif and text
 * @property {HTMLElement} components.summaryTutorialWindow card with summary tutorial gif and text
 */
class TutorialWindowComponent {
  components = {
    panelTutorial: document.querySelector("#tutorial"),
    highlightTutorialWindow: document.querySelector(
      "#highlight-tutorial-window"
    ),
    graphTutorialWindow: document.querySelector("#graph-tutorial-window"),
    summaryTutorialWindow: document.querySelector("#summary-tutorial-window"),
  };

  /**
   * Creates the handler service for managing mouse events on the questions marks elements to display relaive tutorial window
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * Adds event listeners to tutorial window component
   * @private
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(
      PDFLEvents.onShowHighlightTutorialWindow,
      () => {
        this.#showHighlightTutorialWindow();
      }
    );
    EventHandlerService.subscribe(PDFLEvents.onShowGraphTutorialWindow, () => {
      this.#showGraphTutorialWindow();
    });
    EventHandlerService.subscribe(
      PDFLEvents.onShowSummaryTutorialWindow,
      () => {
        this.#showSummaryTutorialWindow();
      }
    );
    EventHandlerService.subscribe(PDFLEvents.onHideTutorialWindow, () => {
      this.#hideTutorialWindow();
    });
  };

  /**
   * Display highlight tutorial window
   * @private
   */
  #showHighlightTutorialWindow = () => {
    this.#showPopup();
    this.components.highlightTutorialWindow.classList.remove("hidden");
  };
  /**
   * Display graph tutorial window
   * @private
   */
  #showGraphTutorialWindow = () => {
    this.#showPopup();
    this.components.graphTutorialWindow.classList.remove("hidden");
  };
  /**
   * Display summary tutorial window
   * @private
   */
  #showSummaryTutorialWindow = () => {
    this.#showPopup();
    this.components.summaryTutorialWindow.classList.remove("hidden");
  };

  /**
   * Display the background panel of the tutorial window
   * @private
   */
  #showPopup = () => {
    this.components.panelTutorial.style = "display:flex";
  };

  /**
   * Hides the background panel of the tutorial window and all the tutorials windows
   * @private
   */
  #hideTutorialWindow = () => {
    this.components.panelTutorial.style = "display:none";
    document
      .querySelectorAll(".tutorial-window")
      .forEach((e) => e.classList.add("hidden"));
  };
}

export { TutorialWindowComponent };
