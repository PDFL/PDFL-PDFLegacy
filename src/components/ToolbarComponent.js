import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { PaginationComponent } from "./PaginationComponent";
import { ZoomComponent } from "./ZoomComponent";

/**
 * Component that serves as a placehodler for all elements in a toolbar. Manages functionality of it's
 * elements, as well as linking components to their methods.
 *
 * @property {Object} components object that holds all DOM elements within this component
 * @property {HTMLElement} components.toolbar element that represents this whole component
 * @property {HTMLElement} components.fullScreen full screen button
 * @property {HTMLElement} components.graphMakerBtn button that generates knowledge graph
 * @property {HTMLElement} components.body body of HTML document
 * @property {HTMLElement} components.thumbnailBtn button that opens the thumbnail
 * @property {PaginationComponent} paginationComponent pagination component
 * @property {ZoomComponent} zoomComponent zoom component
 * @property {HTMLElement} components.helpBtn button that open the tutorial page
 * @property {HTMLElement} components.homeBtn button that takes the user to Welcome Page
 */
class ToolbarComponent {
  components = {
    toolbar: document.querySelector("#sidenav"),
    fullScreen: document.querySelector("#full-screen"),
    graphMakerBtn: document.querySelector("#graph-maker"),
    body: document.querySelector("body"),
    summaryKeyBtn: document.querySelector("#summary-maker"),
    thumbnailBtn: document.querySelector("#pages-sidebar"),
    helpBtn: document.querySelector("#question-mark-margin"),
    homeBtn: document.querySelector("#home-btn-navbar"),
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
    this.components.graphMakerBtn.addEventListener(
      "click",
      this.#showKnowledgeGraph
    );
    this.components.summaryKeyBtn.addEventListener(
      "click",
      this.#showSummaryKey
    );
    this.components.fullScreen.addEventListener("click", this.#showFullScreen);

    this.components.thumbnailBtn.addEventListener(
      "click",
      this.#toggleThumbnail
    );
    this.components.homeBtn.addEventListener("click", this.#showWelcomeView);
    this.components.helpBtn.addEventListener("click", this.#showTutorialPage);

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key, code) => {
        if (functionalKeys.alt && code === "KeyL") {
          this.#showFullScreen();
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
    if (this.components.body.requestFullscreen) {
      this.components.body.requestFullscreen();
    } else if (this.components.body.webkitRequestFullscreen) {
      /* Safari */
      this.components.body.webkitRequestFullscreen();
    } else if (this.components.body.msRequestFullscreen) {
      /* IE11 */
      this.components.body.msRequestFullscreen();
    }
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
   * Triggers the onShowTutorialView event
   */
  #showTutorialPage = () => {
    EventHandlerService.publish(PDFLEvents.onShowTutorialView);
  };

  /**
   * Triggers the onShowWelcomeView event
   */
  #showWelcomeView = () => {
    EventHandlerService.publish(PDFLEvents.onShowWelcomeView);
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
    this.zoomComponent.setZoom(1);
  };
}
export { ToolbarComponent };
