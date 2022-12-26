import { getPaperTLDR } from "../../services/TLDRService";

/**
 * Class representing the TLDR Accordion item
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.tldrText html p element that represents the text of the accordion item
 */
class TLDRComponent {
  components = {
    tldrText: document.querySelector("#tldrText"),
  };

  /**
   * Set the pdf document needed to retrieve the TLDR
   * Once the pdf is ready, start to fetch the tldr
   * @param pdfDoc the current pdf document
   */
  setPdf = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
    this.#loadTLDR();
  };

  /**
   * @private
   * Load the tldr from the current pdf in async way, if no tldr is available, set a message
   */
  #loadTLDR = () => {
    const self = this;
    getPaperTLDR(this.pdfDoc).then((tldr) => {
      if (tldr) {
        self.components.tldrText.innerText = tldr;
      } else {
        self.components.tldrText.innerText =
          "TLDR not available for this paper";
      }
    });
  };
}

export { TLDRComponent };
