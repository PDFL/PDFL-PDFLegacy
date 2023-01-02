import { LOADING_TEXT } from "../../Constants";

/**
 * Class representing the Abstract Accordion Item in DOM
 * @param {HTMLElement} components.abstractText the text container in the accordion
 */
class AbstractAccordionItem {
  components = {
    abstractText: document.querySelector("#abstract-text"),
  };

  /**
   * Set the text of the accordion item
   * @param text text to be set
   */
  setText = (text) => {
    this.components.abstractText.innerText = text;
  };

  /**
   * Set a default error text in case the content cannot be displayed
   */
  setError = () => {
    this.components.abstractText.innerText = "Abstract cannot be loaded";
  };

  /**
   * Set loading constant as a text
   */
  setLoading = () => {
    this.components.abstractText.innerText = LOADING_TEXT;
  };

  /**
   * Clear the content setting the text to empty string
   */
  clear = () => {
    this.components.abstractText.innerText = "";
  };
}

export { AbstractAccordionItem };
