import { LOADING_TEXT } from "../../Constants";
import { textSummarizer } from "../../services/SummarizerService";

/**
 * Class representing the Abstract Summary Accordion Item in DOM
 * @param {HTMLElement} components.abstractSummaryText the text container in the accordion
 */
class AbstractSummaryAccordionItem {
  components = {
    abstractSummaryText: document.querySelector("#abstract-summary-text"),
  };

  /**
   * Set the text of the accordion item given the full text to be summarized
   * @param abstract
   */
  setAbstract = (abstract) => {
    this.components.abstractSummaryText.innerText = textSummarizer(abstract, 6);
  };

  /**
   * Set a default error text in case the content cannot be displayed
   */
  setError = () => {
    this.components.abstractSummaryText.innerText =
      "Abstract summary cannot be generated";
  };

  /**
   * Set loading constant as a text
   */
  setLoading = () => {
    this.components.abstractSummaryText.innerText = LOADING_TEXT;
  };

  /**
   * Clear the content setting the text to empty string
   */
  clear = () => {
    this.components.abstractSummaryText.innerText = "";
  };
}

export { AbstractSummaryAccordionItem };
