import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";
import { PaginationComponent } from "./PaginationComponent";
import { ZoomComponent } from "./ZoomComponent";
import { POPUP_DISAPPEAR_TIMEOUT } from "../../Constants";
import { readFile } from "../../services/FileUploadService";

/**
 * Component that serves as a placehodler for all elements in a toolbar. Manages functionality of it's
 * elements, as well as linking components to their methods.
 *
 * @property {Object} components object that holds all DOM elements within this component
 * @property {HTMLElement} components.fullScreen full screen button
 * @property {HTMLElement} components.graphMakerBtn button that generates knowledge graph
 * @property {HTMLElement} components.thumbnailBtn button that opens the thumbnail
 * @property {PaginationComponent} paginationComponent pagination component
 * @property {ZoomComponent} zoomComponent zoom component
 * @property {HTMLElement} components.summaryKeyBtn button that open and close the sidepage
 * @property {HTMLElement} components.questionMarkHighlight question mark for highlight tutorial window
 * @property {HTMLElement} components.questionMarkGraph question mark for graph tutorial window
 * @property {HTMLElement} components.questionMarkSummary question mark for summary tutorial window
 * @property {HTMLElement} components.openNew button to click for upload a new pdf from the reader component
 * @property {HTMLElement} components.loader loader for showing the pdf uploaded
 * @property {HTMLElement} components.errorMessage error message for a wrong pdf uploaded from the pdf reader component
 */
class ToolbarComponent {
  components = {
    fullScreen: document.querySelector("#full-screen"),
    highlightToggle: document.querySelector("#highlight-toggle"),
    graphMakerBtn: document.querySelector("#graph-maker"),
    summaryKeyBtn: document.querySelector("#summary-maker"),
    questionMarkHighlight: document.querySelector("#tutorial-highlight"),
    questionMarkGraph: document.querySelector("#tutorial-graph"),
    questionMarkSummary: document.querySelector("#tutorial-summary"),
    thumbnailBtn: document.querySelector("#pages-sidebar"),
    openNew: document.querySelector("#open-new-pdf"),
    loader: document.querySelector("#loader"),
    errorMessage: document.querySelector(
      "#message-wrong-type-fileupload-reader"
    ),
  };

  /**
   * Creates and initializes new toolbar component. Creates all components
   * that can be shown within this component.
   * @constructor
   */
  constructor() {
    this.paginationComponent = new PaginationComponent();
    this.zoomComponent = new ZoomComponent();

    this.#registerEvents();
  }

  /**
   * Add event listeners to toolbar buttons.
   * @private
   */
  #registerEvents = () => {
    this.components.highlightToggle.addEventListener(
      "click",
      this.#onHightlightToggleChange.bind(this)
    );
    this.components.graphMakerBtn.addEventListener(
      "click",
      this.#showKnowledgeGraph
    );
    this.components.summaryKeyBtn.addEventListener(
      "click",
      this.#showSummaryKey
    );
    this.components.fullScreen.addEventListener("click", this.#showFullScreen);

    this.components.questionMarkHighlight.addEventListener(
      "mouseenter",
      (event) => {
        event.preventDefault();
        EventHandlerService.publish(PDFLEvents.onShowHighlightTutorialWindow);
      }
    );
    this.components.questionMarkHighlight.addEventListener(
      "mouseleave",
      (event) => {
        event.preventDefault();
        EventHandlerService.publish(PDFLEvents.onHideTutorialWindow);
      }
    );
    this.components.questionMarkGraph.addEventListener(
      "mouseenter",
      (event) => {
        event.preventDefault();
        EventHandlerService.publish(PDFLEvents.onShowGraphTutorialWindow);
      }
    );
    this.components.questionMarkGraph.addEventListener(
      "mouseleave",
      (event) => {
        event.preventDefault();
        EventHandlerService.publish(PDFLEvents.onHideTutorialWindow);
      }
    );
    this.components.questionMarkSummary.addEventListener(
      "mouseenter",
      (event) => {
        event.preventDefault();
        EventHandlerService.publish(PDFLEvents.onShowSummaryTutorialWindow);
      }
    );
    this.components.questionMarkSummary.addEventListener(
      "mouseleave",
      (event) => {
        event.preventDefault();
        EventHandlerService.publish(PDFLEvents.onHideTutorialWindow);
      }
    );
    this.components.thumbnailBtn.addEventListener(
      "click",
      this.#toggleThumbnail
    );

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key, code) => {
        if (functionalKeys.alt && code === "KeyL") {
          this.#showFullScreen();
        }
      }
    );

    this.components.openNew.addEventListener("input", this.#onNewFile);
    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key) => {
        if (!functionalKeys.ctrl) {
          return;
        }
        if (key === "u") {
          this.components.openNew.click();
        }
      }
    );
  };

  /**
   * Triggers event on which knowledge graph will be shown.
   * @private
   */
  #showKnowledgeGraph = () => {
    EventHandlerService.publish(PDFLEvents.onShowKnowledgeGraph);
  };

  /**
   * Triggers event on which Summary Key will be shown.
   * @private
   */
  #showSummaryKey = () => {
    EventHandlerService.publish(PDFLEvents.onShowSummaryKey);
  };

  /**
   * Callback for showing pdf reader view in full screen when button clicked.
   * @private
   */
  #showFullScreen = () => {
    if (document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen();
    else if (document.documentElement.webkitRequestFullscreen)
      document.documentElement.webkitRequestFullscreen();
    else if (document.documentElement.msRequestFullscreen)
      document.documentElement.msRequestFullscreen();
  };

  /**
   * Creates event which opens/closes the thumbnail.
   * @private
   */
  #toggleThumbnail = () => {
    EventHandlerService.publish(
      PDFLEvents.onToggleThumbnail,
      this.paginationComponent.getCurrentPage()
    );
  };

  /**
   * Sets maximum page number of pagination component.
   * @param {int} maxPageNumber new maximum page number
   */
  setPageCount = (maxPageNumber) => {
    this.paginationComponent.setPageCount(maxPageNumber);
  };

  /**
   * Sets current page number of pagination component.
   * @param {int} currentPageNumber new current page number
   */
  setCurrentPage = (currentPageNumber) => {
    this.paginationComponent.setCurrentPage(currentPageNumber);
  };

  /**
   * Getter for current page number of pagination component.
   * @returns {int}
   */
  getCurrentPage = () => {
    return this.paginationComponent.getCurrentPage();
  };

  /**
   * Getter for zoom level of zoom component.
   * @returns {int}
   */
  getZoom = () => {
    return this.zoomComponent.getZoom();
  };

  /**
   * Resets all components to their default values.
   */
  reset = () => {
    this.paginationComponent.setCurrentPage(1);
  };

  /**
   * Call back for checking file format and read it. If the file is not a pdf an error message is displayed
   * @private
   */
  #onNewFile = (event) => {
    if (!event.target.files[0]) return;
    if (event.target.files[0].type === "application/pdf") {
      this.#showLoader();
      this.#hideErrorMessage();
      readFile(event.target.files[0]);
    } else {
      this.#showErrorMessage();
    }
  };

  /**
   * Handler for highlight toggle value changes, publishes and event when the
   * button is toggled.
   * @private
   */
  #onHightlightToggleChange = () => {
    EventHandlerService.publish(
      PDFLEvents.onHighlightToggle,
      this.components.highlightToggle.checked
    );
  };

  /**
   * Hide error message
   * @private
   */
  #hideErrorMessage = () => {
    this.components.errorMessage.classList.add("hidden");
  };

  /**
   * Show error message
   * @private
   */
  #showErrorMessage = () => {
    clearTimeout(messageErrorTimeOut);
    this.components.errorMessage.classList.remove("hidden");
    var messageErrorTimeOut = setTimeout(() => {
      this.hideErrorMessage();
    }, POPUP_DISAPPEAR_TIMEOUT);
  };

  /**
   * Show loader
   * @private
   */
  #showLoader = () => {
    this.components.loader.classList.remove("hidden");
  };
}
export { ToolbarComponent };
