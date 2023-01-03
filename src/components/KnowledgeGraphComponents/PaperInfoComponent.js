import { Node } from "../../services/KnowledgeGraphService";

/**
 * Component that represents a small window with information about paper that node
 * is representing in the graph. This class is responsible for opening, closing and
 * filling the window with node data.
 * @property {Object} components object that holds DOM elements that are this or within this component
 * @property {HTMLElement} components.infoWindow placeholder of this component
 */
class PaperInfoComponent {
  components = {
    infoWindow: document.querySelector("#paper-info"),
  };

  /**
   * Fills window with paper information from node. Displays paper's title,
   * authors and field of study.
   * @param {Node} node node for which paper information is being displayed
   */
  displayPaperInfo = (node) => {
    const window = this.components.infoWindow;
    if (node != null) {
      window.querySelector("#title-info").textContent = node.label;
      window.querySelector("#author-info").textContent = node.author
        .map((a) => a.name)
        .toString();
      window.querySelector("#field-info").textContent = node.field;
      this.components.infoWindow.classList.remove("hidden");
    } else {
      this.components.infoWindow.classList.add("hidden");
    }
  };
}

export { PaperInfoComponent };
