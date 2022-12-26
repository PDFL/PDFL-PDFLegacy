import { getPaperAbstract } from "../../services/AbstractService";
import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";

/**
 * Class representing the Abstract Accordion item
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.abstractText html p element that represents the text of the accordion item
 */
class AbstractComponent {
  components = {
    abstractText: document.querySelector("#abstractText"),
  };

  /**
   * Set the pdf document needed to retrieve the Abstract
   * Once the pdf is ready, start to fetch the Abstract
   * @param pdfDoc the current pdf document
   */
  setPdf = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
    this.#loadAbstract();
  };

  /**
   * @private
   * Load the abstract from the current pdf in async way, if no abstract is available, set a message
   */
  #loadAbstract = () => {
    const self = this;
    getPaperAbstract(this.pdfDoc).then((abstract) => {
      if (abstract) {
        self.components.abstractText.innerText = abstract;
        EventHandlerService.publish(PDFLEvents.onAbstractReady, abstract);
      } else {
        self.components.abstractText.innerText =
          "Abstract not available for this paper";
      }
    });
  };
}

export { AbstractComponent };
