import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { KnowledgeGraphComponent } from "./KnowledgeGraphComponent";
import { SidePageLoaderComponent } from "./SidePageLoaderComponent";

/**
 * Component representing side window that can be closed. It is a placeholder
 * for other components to be shown.
 *
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.closeBtn button that closes side page
 * @property {HTMLElement} components.sideNav placeholder of this component
 * @property {HTMLElement} components.pdfContainer sibling component of this component that displays PDF reader
 * @property {KnowledgeGraphComponent} knowledgeGraphComponent knowledge graph component
 * @property {SidePageLoaderComponent} loader component that displays loader in this page
 * @property {boolean} isKnowledgeGraphOpen true if the knowledge graph is open
 */
class SidePageComponent {
  components = {
    closeBtn: document.querySelector("#close-btn"),
    sideNav: document.querySelector("#side-page"),
    pdfContainer: document.querySelector("#pdf-container"),
  };

  /**
   * Creates and initializes new side page component. Creates all components
   * that can be shown within this component, as well as the loader.
   * @constructor
   */
  constructor() {
    this.knowledgeGraphComponent = new KnowledgeGraphComponent();
    this.loader = new SidePageLoaderComponent();
    this.isKnowledgeGraphOpen = false;
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements and component itself.
   * @private
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(PDFLEvents.onShowKnowledgeGraph, () => {
      this.#showKnowledgeGraph();
    });
    this.components.closeBtn.addEventListener("click", this.hideSidePage);
    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key) => {
        if (functionalKeys.ctrl && key === 71) {
          if (this.isKnowledgeGraphOpen) {
            this.hideSidePage();
            this.isKnowledgeGraphOpen = false;
          } else {
            this.#showKnowledgeGraph();
            this.isKnowledgeGraphOpen = true;
          }
        }
      }
    );
  };

  /**
   * Callback for generation of a knowledge graph.
   */
  #showKnowledgeGraph = () => {
    this.#showSidePage();
    this.knowledgeGraphComponent.displayGraph();
  };

  /**
   * Callback for making a component visible.
   * @private
   */
  #showSidePage = () => {
    this.components.sideNav.className = "half-width";
    this.components.pdfContainer.className = "half-width";
  };

  /**
   * Callback for making a component not visible.
   */
  hideSidePage = () => {
    this.components.sideNav.className = "no-width";
    this.components.pdfContainer.className = "full-width";
  };

  setPDF = (data) => {
    this.knowledgeGraphComponent.setPDF(data);
  };
}
export { SidePageComponent };
