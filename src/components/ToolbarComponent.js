import {
    EventHandlerService,
    PDFLEvents,
  } from "../services/EventHandlerService";
import { PaginationComponent } from "./PaginationComponent";
import { ZoomComponent } from "./ZoomComponent";

class ToolbarComponent {
  components = {
    fullScreen: document.querySelector("#full-screen"),
    graphMakerBtn: document.querySelector("#graph-maker"),
    body: document.querySelector("body")
  };

  /**
   * @constructor
   */
  constructor() {
    this.paginationComponent = new PaginationComponent();
    this.zoomComponent = new ZoomComponent();

    this.#registerEvents();
  }

  /**
   * Add event listeners to toolbar buttons.
   */
  #registerEvents = () => {
    this.components.graphMakerBtn.addEventListener("click", this.#showKnowledgeGraph);
    this.components.fullScreen.addEventListener("click", this.#showFullScreen);
  };

  #showKnowledgeGraph = () => {
    EventHandlerService.publish(PDFLEvents.onShowKnowledgeGraph);
  }

  /**
   * Callback for showing pdf reader view in full screen when button clicked
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

  setPageCount = (maxPageNumber) => {
    this.paginationComponent.setPageCount(maxPageNumber);
  };

  setCurrentPage = (currentPageNumber) => {
    this.paginationComponent.setCurrentPage(currentPageNumber);
  };

  getCurrentPage = () => {
    return this.paginationComponent.getCurrentPage();
  };

  getZoom = () => {
    return this.zoomComponent.getZoom();
  };

  reset = () => {
    this.paginationComponent.setCurrentPage(1);
    this.zoomComponent.setZoom(1);
  };
}
export { ToolbarComponent };
