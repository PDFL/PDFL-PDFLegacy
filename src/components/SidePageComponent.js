import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { KnowledgeGraphComponent } from "./KnowledgeGraphComponent";
import { SummaryKeyComponent } from "./SummaryKeyComponent";
import { SidePageLoaderComponent } from "./SidePageLoaderComponent";

/**
 * Component representing side window that can be closed. It is a placeholder
 * for other components to be shown.
 *
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.closeBtn button that closes side page
 * @property {HTMLElement} components.sideNav placeholder of this component
 * @property {HTMLElement} components.pdfContainer sibling component of this component that displays PDF reader
 * @property {HTMLElement} components.slider input element for depth selection
 * @property {KnowledgeGraphComponent} knowledgeGraphComponent knowledge graph component
 * @property {SidePageLoaderComponent} loader component that displays loader in this page
 * @property {boolean} isKnowledgeGraphOpen true if the knowledge graph is open
 */
class SidePageComponent {
  components = {
    closeBtn: document.querySelector("#close-btn"),
    sideNav: document.querySelector("#side-page"),
    pdfContainer: document.querySelector("#pdf-container"),
    slider: document.querySelector("#graph-depth"),
  };

  /**
   * Creates and initializes new side page component. Creates all components
   * that can be shown within this component, as well as the loader.
   * @constructor
   */
  constructor() {
    this.knowledgeGraphComponent = new KnowledgeGraphComponent();
    this.summaryKeyComponent = new SummaryKeyComponent();
    this.loader = new SidePageLoaderComponent();
    this.isKnowledgeGraphOpen = false;
    this.isSummaryKeyOpen = false;
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

    EventHandlerService.subscribe(PDFLEvents.onShowSummaryKey, () => {
      this.#showSummaryKey();
    });
    this.components.closeBtn.addEventListener("click", this.hideSidePage);
    this.summaryKeyComponent.components.closeBtn.addEventListener(
      "click",
      this.hideSidePageSummary
    );

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key, code) => {
        if (functionalKeys.ctrl && key === "g") {
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

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key, code) => {
        if (functionalKeys.ctrl && key === "y") {
          if (this.isSummaryKeyOpen) {
            this.hideSidePageSummary();
            this.isSummaryKeyOpen = false;
          } else {
            this.#showSummaryKey();
            this.isSummaryKeyOpen = true;
          }
        }
      }
    );
  };

  /**
   * Callback for generation of a knowledge graph.
   */
  #showKnowledgeGraph = () => {
    if (this.isSummaryKeyOpen) {
      this.hideSidePageSummary();
    }
    this.#showSidePage();
    this.knowledgeGraphComponent.displayGraph();
    this.isKnowledgeGraphOpen = true;
  };

  /**
   * Callback for generation of the summary
   */
  #showSummaryKey = () => {
    if (this.isKnowledgeGraphOpen) {
      this.hideSidePage();
    }
    this.#showSidePageSummary();
    this.summaryKeyComponent.createPageSummary();
    this.isSummaryKeyOpen = true;
  };

  /**
   * Callback for making a component visible.
   * @private
   */
  #showSidePageSummary = () => {
    let summaryKeyComponent = this.summaryKeyComponent.components;
    summaryKeyComponent.sidePageSummary.className = "one-third-width";
    summaryKeyComponent.closeBtn.className = "closebtn";
  };

  /**
   * Callback for making a component not visible.
   */
  hideSidePage = () => {
    this.components.slider.value = 1;
    this.knowledgeGraphComponent.depth = 1;
    this.components.sideNav.className = "no-width";
    this.components.pdfContainer.className = "full-width";
  };

  /**
   * Callback for making a component not visible.
   */
  hideSidePageSummary = () => {
    let summaryKeyComponent = this.summaryKeyComponent.components;
    summaryKeyComponent.sidePageSummary.className = "hidden";
    summaryKeyComponent.closeBtn.className = "hidden";
  };

  /**
   * Callback for making a component visible.
   * @private
   */
  #showSidePage = () => {
    this.components.sideNav.className = "half-width";
    this.components.pdfContainer.className = "half-width";
    this.isSummaryKeyOpen = false;
  };

  /**
   * Callback for making a component not visible.
   */
  hideSidePage = () => {
    this.components.slider.value = 1;
    this.knowledgeGraphComponent.depth = 1;
    this.components.sideNav.className = "no-width";
    this.components.pdfContainer.className = "full-width";
  };

  setPDF = (data) => {
    this.knowledgeGraphComponent.setPDF(data);
  };
}
export { SidePageComponent };
