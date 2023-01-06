import { LOADING_TEXT, SUMMARY_KEY_ERROR_MESSAGE } from "../../Constants";

/**
 * Class representing a generic Accordion Item
 * @param {Object} components object to set the element component
 */
class AccordionItem {
  components = {};

  /**
   * @constructor
   * @param {HTMLElement} accordionText the element in which fill the text
   */
  constructor(accordionText) {
    this.components.accordionText = accordionText;
  }

  /**
   * Set the text of the accordion item
   * @param text text to be set
   */
  setText = (text) => {
    this.components.accordionText.innerText = text;
  };

  /**
   * Set a default error text in case the content cannot be displayed
   */
  setError = () => {
    this.components.accordionText.innerText = SUMMARY_KEY_ERROR_MESSAGE;
  };

  /**
   * Set loading constant as a text
   */
  setLoading = () => {
    this.components.accordionText.innerText = LOADING_TEXT;
  };

  /**
   * Clear the content setting the text to empty string
   */
  clear = () => {
    this.components.accordionText.innerText = "";
  };
}

export { AccordionItem };
