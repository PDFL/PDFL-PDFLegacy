import { Node } from "../../services/KnowledgeGraphService";

/**
 * Component that representing a small window with information. This component displays infomation
 * about paper that node is representing in graph. This class is responsible for opening, closing
 * and filling the window with data from node. This component also contains a button that when
 * pressed expands the node.
 *
 * @property {Object} components that holds DOM elements that are this or within this component
 * @property {HTMLElement} components.infoWindow placeholder of this component
 */
class PaperInfoComponent {
  components = {
    infoWindow: document.querySelector("#paper-info"),
  };

  /**
   * Fills window with paper information from node. Displays papers title,
   * authors and field of study.
   *
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
