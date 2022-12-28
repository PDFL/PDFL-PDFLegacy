import { LOADING_TEXT, SELECTION_INSTRUCTION_TEXT } from "../../Constants";

/**
 * Class representing the Selection Summary Accordion Item in DOM
 * @param {HTMLElement} components.selectionSummaryText the text container in the accordion
 */
class SelectionSummaryAccordionItem {
  components = {
    selectionSummaryText: document.querySelector("#selection-summary-text"),
  };

  /**
   * Set the text of the accordion item
   * @param text text to be set
   */
  setText = (text) => {
    this.components.selectionSummaryText.innerText = text;
  };

  /**
   * Set a default error text in case the content cannot be displayed
   */
  setError = () => {
    this.components.selectionSummaryText.innerText =
      "Summary cannot be generated";
  };

  /**
   * Set loading constant as a text
   */
  setLoading = () => {
    this.components.selectionSummaryText.innerText = LOADING_TEXT;
  };

  /**
   * Clear the content setting the text to the instruction string from constrants
   */
  clear = () => {
    this.components.selectionSummaryText.innerText = SELECTION_INSTRUCTION_TEXT;
  };
}

export { SelectionSummaryAccordionItem };
