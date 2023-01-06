import { SELECTION_INSTRUCTION_TEXT } from "../../Constants";
import { textSummarizer } from "../../services/SummarizerService";
import { AccordionItem } from "./AccordionItem";

/**
 * Class representing the Selection Summary Accordion Item in DOM
 */
class SelectionSummaryAccordionItem extends AccordionItem {
  /**
   * @constructor
   * Set superclass parameters
   */
  constructor() {
    super(document.querySelector("#selection-summary-text"));
  }

  /**
   * @override
   * Set the text of the accordion item to be summarized
   * @param text text to be set
   */
  setText = (text) => {
    this.components.accordionText.innerText = textSummarizer(text, 6);
  };

  /**
   * @override
   * Clear the content setting the text to the instruction string from constrants
   */
  clear = () => {
    this.components.accordionText.innerText = SELECTION_INSTRUCTION_TEXT;
  };
}

export { SelectionSummaryAccordionItem };
