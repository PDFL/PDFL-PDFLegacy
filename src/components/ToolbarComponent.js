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
 * @property {HTMLElement} components.fullScreen full screen button
 * @property {HTMLElement} components.graphMakerBtn button that generates knowledge graph
 * @property {HTMLElement} components.body body of HTML document
 * @property {PaginationComponent} paginationComponent pagination component
 * @property {ZoomComponent} zoomComponent zoom component
 */
class ToolbarComponent {
  components = {
    fullScreen: document.querySelector("#full-screen"),
    graphMakerBtn: document.querySelector("#graph-maker"),
    body: document.querySelector("body"),
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
    this.components.fullScreen.addEventListener("click", this.#showFullScreen);
  };

  /**
   * Triggers event on which knowledge graph will be shown.
   * @private
   */
  #showKnowledgeGraph = () => {
    EventHandlerService.publish(PDFLEvents.onShowKnowledgeGraph);
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
