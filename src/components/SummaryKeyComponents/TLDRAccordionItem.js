import { LOADING_TEXT } from "../../Constants";

/**
 * Class representing the TLDR Accordion Item in DOM
 * @param {HTMLElement} components.tldrText the text container in the accordion
 */
class TLDRAccordionItem {
  components = {
    tldrText: document.querySelector("#tldr-text"),
  };

  /**
   * Set the text of the accordion item
   * @param text text to be set
   */
  setText = (text) => {
    this.components.tldrText.innerText = text;
  };

  /**
   * Set a default error text in case the content cannot be displayed
   */
  setError = () => {
    this.components.tldrText.innerText = "TLDR cannot be loaded";
  };

  /**
   * Set loading constant as a text
   */
  setLoading = () => {
    this.components.tldrText.innerText = LOADING_TEXT;
  };

  /**
   * Clear the content setting the text to empty string
   */
  clear = () => {
    this.components.tldrText.innerText = "";
  };
}

export { TLDRAccordionItem };
