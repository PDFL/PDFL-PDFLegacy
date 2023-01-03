import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";
import { KnowledgeGraphComponent } from "../KnowledgeGraphComponents/KnowledgeGraphComponent";
import { SummaryKeyComponent } from "../SummaryKeyComponents/SummaryKeyComponent";
import { SidePageLoaderComponent } from "./SidePageLoaderComponent";

/**
 * Component representing side window that can be closed. It is a placeholder
 * for other components to be shown.
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.closeBtn button that closes side page
 * @property {HTMLElement} components.sideNav placeholder of this component
 * @property {HTMLElement} components.pdfContainer sibling component of this component that displays PDF reader
 * @property {KnowledgeGraphComponent} knowledgeGraphComponent knowledge graph component
 * @property {SidePageLoaderComponent} loader component that displays loader in this page
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
    this.summaryKeyComponent = new SummaryKeyComponent();
    this.loader = new SidePageLoaderComponent();
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements and component itself.
   * @private
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key) => {
        this.#resolveKeyboardEvent(functionalKeys, key);
      }
    );

    EventHandlerService.subscribe(PDFLEvents.onShowKnowledgeGraph, () => {
      this.#toggleKnowledgeGraph();
    });

    EventHandlerService.subscribe(PDFLEvents.onShowSummaryKey, () => {
      this.#toggleSummary();
    });

    this.components.closeBtn.addEventListener("click", () => {
      this.#hideSidePage();
    });

    EventHandlerService.subscribe(PDFLEvents.onResetReader, () => {
      this.#hideSidePage();
    });
  };

  /**
   * Resolves combination of functional key and key pressed. If CTRL + g is pressed
   * knowledge graph display will be toggled and if CTRL + y is pressed summary display
   * will be toggled.
   * @private
   * @param {{ctrl: boolean, shift: boolean, alt: boolean}} functionalKeys functional keys pressed
   * @param {string} key key pressed
   */
  #resolveKeyboardEvent = (functionalKeys, key) => {
    if (functionalKeys.ctrl && key === "g") this.#toggleKnowledgeGraph();
    if (functionalKeys.ctrl && key === "y") this.#toggleSummary();
  };

  /**
   * Displays knowledge graph in side page if it is not displayed and hides it if displayed.
   * @private
   */
  #toggleKnowledgeGraph = () => {
    if (this.knowledgeGraphComponent.isOpened()) return this.#hideSidePage();

    this.loader.hideLoader();
    this.summaryKeyComponent.hide();
    this.components.closeBtn.className = "close-btn-graph";
    this.#showSidePage();
    this.knowledgeGraphComponent.displayGraph();
  };

  /**
   * Displays summary in side page if it is not displayed and hides it if displayed.
   * @private
   */
  #toggleSummary = () => {
    if (this.summaryKeyComponent.isOpened()) return this.#hideSidePage();

    this.loader.hideLoader();
    this.knowledgeGraphComponent.hide();
    this.#showSidePage();
    this.components.closeBtn.className = "close-btn-summary";
    this.summaryKeyComponent.show();
  };

  /**
   * Hides this whole component.
   * @private
   */
  #hideSidePage = () => {
    this.knowledgeGraphComponent.reset();
    this.knowledgeGraphComponent.hide();
    this.summaryKeyComponent.hide()

    this.components.sideNav.className = "hidden";
    this.components.pdfContainer.className = "full-width";
  };

  /**
   * Displays this whole component.
   * @private
   */
  #showSidePage = () => {
    this.components.sideNav.className = "half-width";
    this.components.pdfContainer.className = "half-width";
  };
}

export { SidePageComponent };
