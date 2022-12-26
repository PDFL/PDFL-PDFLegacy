import { textSummarizer } from "../../services/SummarizerService";
import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";
import { SelectionPopUpComponent } from "../SelectionPopUpComponent";

/**
 * Class representing the Selection Summary Accordion item
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.selectedSummaryText html p element that represents the text of the accordion item

 */
class SelectionSummaryComponent {
  components = {
    selectedSummaryText: document.querySelector("#selectedSummaryText"),
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
   * Register subscriber to get selected text to summarize
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(
      PDFLEvents.onTextSelectionReady,
      this.#computeSummary.bind(this)
    );
  };

  /**
   * @private
   * Callback for the subscriber
   * Create summary and display it, then request te side to open
   * @param {string} text text to be summarized
   */
  #computeSummary = (text) => {
    this.components.selectedSummaryText.innerText = textSummarizer(text, 5);
    EventHandlerService.subscribe(PDFLEvents.onOpenSelectionSummary);
  };
}

export { SelectionSummaryComponent };
