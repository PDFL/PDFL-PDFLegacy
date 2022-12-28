import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { KnowledgeGraphComponent } from "./KnowledgeGraphComponent";
import { SummaryKeyComponent } from "./SummaryKeyComponents/SummaryKeyComponent";
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
    this.currentOpenElement = SideElement.None;
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
          if (this.currentOpenElement === SideElement.KnowledgeGraph) {
            this.hideSidePage();
            this.currentOpenElement = SideElement.None;
          } else {
            this.#showKnowledgeGraph();
            this.currentOpenElement = SideElement.KnowledgeGraph;
          }
        }
      }
    );

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key, code) => {
        if (functionalKeys.ctrl && key === "y") {
          if (this.currentOpenElement === SideElement.SummaryKey) {
            this.hideSidePageSummary();
            this.currentOpenElement = SideElement.None;
          } else {
            this.#showSummaryKey();
            this.currentOpenElement = SideElement.SummaryKey;
          }
        }
      }
    );
  };

  /**
   * Callback for generation of a knowledge graph.
   */
  #showKnowledgeGraph = () => {
    if (this.currentOpenElement === SideElement.SummaryKey) {
      this.hideSidePageSummary();
    }
    this.#showSidePage();
    this.knowledgeGraphComponent.displayGraph();
    this.currentOpenElement = SideElement.KnowledgeGraph;
  };

  /**
   * Callback for generation of the summary
   */
  #showSummaryKey = () => {
    if (this.currentOpenElement === SideElement.KnowledgeGraph) {
      this.hideSidePage();
    }
    this.#showSidePageSummary();
    this.summaryKeyComponent.createPageSummary();
    this.currentOpenElement = SideElement.SummaryKey;
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

  /**
   * Set a pdf document from the reader to the subcomponents
   * @param data current pdf data
   */
  setPDF = (data) => {
    this.knowledgeGraphComponent.setPDF(data);
    this.summaryKeyComponent.setPdf(data);
  };
}

/**
 * Enum of possible side element (to avoid typos)
 * @type {{None: string, KnowledgeGraph: string, SummaryKey: string, Reference: string}}
 */
const SideElement = {
  None: "None",
  KnowledgeGraph: "KnowledgeGraph",
  SummaryKey: "SummaryKey",
  Reference: "Reference",
};

export { SidePageComponent };
