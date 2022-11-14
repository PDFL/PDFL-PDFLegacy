import { GraphMakerComponent } from "./GraphMakerComponent";

/**
 * Component representing side window that can be closed. It is a placeholder
 * for other components to be shown.
 *
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.graphMakerBtn button that generates knowledge graph
 * @property {HTMLElement} components.closeBtn button that closes side page
 * @property {HTMLElement} components.sideNav placeholder of this component
 * @property {HTMLElement} components.pdfContainer sibling component of this component that displays PDF reader
 */
class SidePageComponent {
  components = {
    graphMakerBtn: document.querySelector("#graph-maker"),
    closeBtn: document.querySelector("#close-btn"),
    sideNav: document.querySelector("#side-page"),
    pdfContainer: document.querySelector("#pdf-container"),
  };

  /**
   * Creates and initializes new side page component. Creates all components
   * that can be shown within this component.
   * @constructor
   */
  constructor() {
    this.graphMakerComponent = new GraphMakerComponent();

    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.graphMakerBtn.addEventListener("click", this.#showKnowledgeGraph);
    this.components.closeBtn.addEventListener("click", this.#hideSidePage);
  };

  /**
   * Callback for generation of knowledge graph.
   */
  #showKnowledgeGraph = () => {
    this.#showSidePage();
    this.graphMakerComponent.displayGraph();
  };

  /**
   * Callback for making component visible.
   * @private
   */
  #showSidePage = () => {
    this.components.sideNav.className = "half-width";
    this.components.pdfContainer.className = "half-width";
  };

  /**
   * Callback for making component not visible.
   * @private
   */
  #hideSidePage = () => {
    this.components.sideNav.className = "no-width";
    this.components.pdfContainer.className = "full-width";
  };
}
export { SidePageComponent };
