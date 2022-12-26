import { getPaperSummaries } from "../../services/SemanticScholarService";

/**
 * Class representing the Abstract and the TLDR Accordion items
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.abstractText html p element that represents the text of the accordion item
 * @property {HTMLElement} components.tldrText html p element that represents the text of the accordion item
 */
class SemScholarAbstractComponent {
  components = {
    tldrText: document.querySelector("#tldrText"),
    abstractText: document.querySelector("#abstractText"),
  };

  /**
   * Set the pdf document needed to retrieve the Abstract
   * Once the pdf is ready, start to fetch the Abstract
   * @param pdfDoc the current pdf document
   */
  setPdf = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
    this.#loadAbstracts();
  };

  /**
   * @private
   * Load the abstract from the current pdf in async way, if no abstract is available, set a message
   */
  #loadAbstracts = () => {
    const self = this;
    getPaperSummaries(this.pdfDoc).then((abstracts) => {
      if (!abstracts) {
        self.components.abstractText.innerText =
          "Abstract not available for this paper";
        self.components.tldrText.innerText =
          "TLDR not available for this paper";
        return;
      }
      if (abstracts.abstract) {
        self.components.abstractText.innerText = abstracts.abstract;
      } else {
        self.components.abstractText.innerText =
          "Abstract not available for this paper";
      }
      if (abstracts.tldr) {
        self.components.tldrText.innerText = abstracts.tldr;
      } else {
        self.components.tldrText.innerText =
          "TLDR not available for this paper";
      }
    });
  };
}

export { SemScholarAbstractComponent };
