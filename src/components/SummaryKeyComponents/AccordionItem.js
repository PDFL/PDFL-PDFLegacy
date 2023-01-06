import { LOADING_TEXT } from "../../Constants";

/**
 * Class representing a generic Accordion Item
 * @param {Object} components object to set the element component
 * @param {String} errorMessage the specific message the component has to show
 */
class AccordionItem {
  components = {};

  /**
   * @constructor
   * @param {HTMLElement} accordionText the element in which fill the text
   * @param {string} errorMessage the specific error message to be shown
   */
  constructor(accordionText, errorMessage) {
    this.components.accordionText = accordionText;
    this.errorMessage = errorMessage;
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
    this.components.accordionText.innerText = this.errorMessage;
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

export { AccordionItem };
