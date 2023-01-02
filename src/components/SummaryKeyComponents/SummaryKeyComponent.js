import { getPaperTldrAndAbstract } from "../../services/SemanticScholarService";
import { TLDRAccordionItem } from "./TLDRAccordionItem";
import { AbstractAccordionItem } from "./AbstractAccordionItem";
import { AbstractSummaryAccordionItem } from "./AbstractSummaryAccordionItem";
import { SelectionSummaryAccordionItem } from "./SelectionSummaryAccordionItem";
import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";

/**
 * Component responsible for displaying the sidebar for summaries/key
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.accordionItem accordion item
 * @property {HTMLElement} components.closeBtn button that closes sidepage
 * @property {AccordionItem} tldrItem the TLDR Accordion Item instance
 * @property {AccordionItem} abstractItem the Abstract Accordion Item instance
 * @property {AccordionItem} abstractSummaryItem the Abstract Summary Accordion Item instance
 * @property {AccordionItem} selectionSummaryItem the Selection Summary Accordion Item instance
 */
class SummaryKeyComponent {
  components = {
    sidePageSummary: document.querySelector("#side-page-summary"),
    accordionItem: document.getElementsByClassName("accordion"),
  };

  /**
   * Creates and initializes new Summary Key Component
   * @constructor
   */
  constructor() {
    this.tldrItem = new TLDRAccordionItem();
    this.abstractItem = new AbstractAccordionItem();
    this.abstractSummaryItem = new AbstractSummaryAccordionItem();
    this.selectionSummaryItem = new SelectionSummaryAccordionItem();
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements.
   * @private
   */
  #registerEvents = () => {
    Array.from(this.components.accordionItem).forEach((accordion) => {
      accordion.addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });

    EventHandlerService.subscribe(
      PDFLEvents.onTextSelectionReady,
      this.#selectionSummarizerCallback.bind(this)
    );
    EventHandlerService.publish(
      PDFLEvents.onOpenSelectionSummary,
      this.#showSelectedText.bind(this)
    );
  };

  /**
   * Triggers event on which accordion of the selected text for Summary is automatically opens
   * @private
   */
  #showSelectedText = () => {
    document.querySelector("#selected-text-summary").classList.add("active");
    document.querySelector("#selected-summary-text-panel").style.maxHeight =
      "max-content";
  };

  /**
   * Setter for pdf document from caller,
   * start actions when pdf is ready
   * @param pdfDoc
   */
  setPdf = (pdfDoc) => {
    this.tldrItem.setLoading();
    this.abstractItem.setLoading();
    this.abstractSummaryItem.setLoading();
    this.selectionSummaryItem.clear();
    this.#getSemScholarContent(pdfDoc);
  };

  /**
   * @private
   * Load data SummaryKey data from semantic scholar and when thery are ready set data to items
   * @param pdfDoc
   * @returns {Promise<void>}
   */
  #getSemScholarContent = async (pdfDoc) => {
    const contents = await getPaperTldrAndAbstract(pdfDoc);
    if (!contents) {
      this.tldrItem.setError();
      this.abstractItem.setError();
      this.abstractSummaryItem.setError();
      return;
    }
    if (contents.abstract) {
      this.abstractItem.setText(contents.abstract);
      this.abstractSummaryItem.setAbstract(contents.abstract);
    } else {
      this.abstractItem.setError();
      this.abstractSummaryItem.setError();
    }
    if (contents.tldr) {
      this.tldrItem.setText(contents.tldr);
    } else {
      this.tldrItem.setError();
    }
  };

  /**
   * Callback for the selection summary event which set the selected text to the item
   * @param text
   */
  #selectionSummarizerCallback = (text) => {
    this.selectionSummaryItem.setText(text);
  };

  /**
   * Returns true if this component is displayed in side window and false otherwise.
   * @returns {boolean}
   */
  isOpened(){
    return !this.components.sidePageSummary.classList.contains("hidden");
  }

  /**
   * Hides this whole component.
   */
  hide = () => {
    this.components.sidePageSummary.classList.add("hidden");
  }

  /**
   * Displays this whole component.
   */
  show = () => {
    this.components.sidePageSummary.classList.remove("hidden");
  }
}

export { SummaryKeyComponent };
