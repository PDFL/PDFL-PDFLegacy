import { AccordionItem } from "./AccordionItem";

/**
 * Class representing the Abstract Accordion Item in DOM
 */
class AbstractAccordionItem extends AccordionItem {
  /**
   * @constructor
   * Set superclass parameters
   */
  constructor() {
    super(
      document.querySelector("#abstract-text"),
      "Abstract cannot be loaded"
    );
  }
}

export { AbstractAccordionItem };
