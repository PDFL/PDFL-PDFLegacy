import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";
import { textSummarizer } from "../../services/SummarizerService";

/**
 * Class representing the Abstract Summary Accordion item
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.abstractSummaryText html p element that represents the text of the accordion item
 */
class AbstractSummaryComponent {
  components = {
    abstractSummaryText: document.querySelector("#abstract-summary-text"),
  };

  /**
   * @constructor
   * Register needed events
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * @private
   * Subscribe to the event waiting for the abstract ready
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(
      PDFLEvents.onAbstractReady,
      this.#summarizeAbstract.bind(this)
    );
  };

  /**
   * @private
   * Callback for abstract ready event
   * Summarize the abstract and load it into dom element
   */
  #summarizeAbstract = (abstract) => {
    this.components.abstractSummaryText.innerText = textSummarizer(abstract, 6);
  };
}

export { AbstractSummaryComponent };
