import { getPaperTldrAndAbstract } from "../../services/SemanticScholarService";
import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";

/**
 * Class representing the Abstract and the TLDR Accordion items
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.abstractText html p element that represents the text of the accordion item
 * @property {HTMLElement} components.tldrText html p element that represents the text of the accordion item
 */
class SemScholarAbstractAndTldrComponent {
  components = {
    tldrText: document.querySelector("#tldr-text"),
    abstractText: document.querySelector("#abstract-text"),
  };

  /**
   * Set the pdf document needed to retrieve the Abstract and the TLDR
   * Once the pdf is ready, start to fetch data
   * @param pdfDoc the current pdf document
   */
  setPdf = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
    this.#loadData();
  };

  /**
   * @private
   * Load the abstract and the TLDR from the current pdf in async way, if no data is available, set a message
   */
  #loadData = () => {
    const self = this;
    getPaperTldrAndAbstract(this.pdfDoc).then((abstracts) => {
      if (!abstracts) {
        self.components.abstractText.innerText =
          "Abstract not available for this paper";
        self.components.tldrText.innerText =
          "TLDR not available for this paper";
        return;
      }
      if (abstracts.abstract) {
        self.components.abstractText.innerText = abstracts.abstract;
        EventHandlerService.publish(
          PDFLEvents.onAbstractReady,
          abstracts.abstract
        );
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

export { SemScholarAbstractAndTldrComponent };
