import { textSummarizer } from "../../services/SummarizerService";
import { AccordionItem } from "./AccordionItem";

/**
 * Class representing the Abstract Summary Accordion Item in DOM
 */
class AbstractSummaryAccordionItem extends AccordionItem {
  /**
   * @constructor
   * Set superclass parameters
   */
  constructor() {
    super(
      document.querySelector("#abstract-summary-text"),
      "Abstract summary cannot be generated"
    );
  }

  /**
   * Set the text af the abstract
   * @param abstract
   */
  setAbstract = (abstract) => {
    this.setText(textSummarizer(abstract, 6));
  };
}

export { AbstractSummaryAccordionItem };
