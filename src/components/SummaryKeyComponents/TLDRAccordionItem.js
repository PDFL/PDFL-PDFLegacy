import { AccordionItem } from "./AccordionItem";

/**
 * Class representing the TLDR Accordion Item in DOM
 */
class TLDRAccordionItem extends AccordionItem {
  /**
   * @constructor
   * Set superclass parameters
   */
  constructor() {
    super(document.querySelector("#tldr-text"));
  }
}

export { TLDRAccordionItem };
