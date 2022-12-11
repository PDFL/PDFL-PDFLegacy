import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import {
    Node,
  } from "../services/KnowledgeGraphService";

/**
 * Component that representing a small window with information. This component displays infomation
 * about paper that node is representing in graph. This class is responsible for opening, closing
 * and filling the window with data from node. This component also contains a button that when 
 * pressed expands the node.
 * 
 * @property {Object} components that holds DOM elements that are this or within this component
 * @property {HTMLElement} components.infoWindow placeholder of this component
 * @property {HTMLElement} components.closeButton button that closes the window
 * @property {HTMLElement} components.expandButton button that expands the node
 */
class PaperInfoComponent {
  components = {
    infoWindow: document.querySelector("#paper-info"),
    closeButton: document.querySelector("#info-close-btn"),
    expandButton : document.querySelector("#expand-node-btn")
  };

  /**
   * Creates and initializes new paper info component.
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements.
   */
  #registerEvents = () => {
    this.components.closeButton.addEventListener("click", () => this.#closeWindow());
  }

  /**
   * Closes window representing this component.
   */
  #closeWindow = () => {
    this.components.infoWindow.classList.add("hidden");
  }

/**
 * Fills window with paper information from node. Displays papers title,
 * authors and field of study.
 * 
 * @param {ForceGraph} graph currently displayed knowledge graph
 * @param {Node} node node for which paper information is being displayed
 */
  displayPaperInfo = (graph, node) => {
    const window = this.components.infoWindow;

    window.querySelector("#title-info").textContent = node.label;
    window.querySelector("#author-info").textContent = node.author.map(a => a.name).join(', ');
    window.querySelector("#field-info").textContent = node.field;

    window.classList.remove("hidden");

    this.components.expandButton.addEventListener("click", () => this.#expandNode(node, graph));
  }
  
  /**
   * Callback when expand button is clicked. Adds node's 
   * citations and references to graph.
   * 
   * @param {Node} node node being expanded
   * @param {ForceGraph} graph currently displayed knowledge graph
   */
  #expandNode = (node, graph) => {
    node.color = "red"; //TODO: remove
    //TODO: call PL-109 expandNode
  }

}

export { PaperInfoComponent };