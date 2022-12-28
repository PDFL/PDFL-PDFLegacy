import { SemScholarAbstractAndTldrComponent } from "./SemScholarAbstractAndTldrComponent";
import { AbstractSummaryComponent } from "./AbstractSummaryComponent";

/**
 * Component responsible for displaying the sidebar for summaries/key
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.accordionItem accordion item
 * @property {HTMLElement} components.closeBtn button that closes sidepage
 * @property {SemScholarAbstractAndTldrComponent} abstractAndTldrComponent
 * @property {AbstractSummaryComponent} abstractSummaryComponent abstract summary component instance
 */
class SummaryKeyComponent {
  components = {
    sidePageSummary: document.querySelector("#side-page-summary"),
    accordionItem: document.getElementsByClassName("accordion"),
    closeBtn: document.querySelector("#close-btn-summary"),
  };

  /**
   * Creates and initializes new Summary Key Component
   * @constructor
   */
  constructor() {
    this.abstractAndTldrComponent = new SemScholarAbstractAndTldrComponent();
    this.abstractSummaryComponent = new AbstractSummaryComponent();
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
  };

  /**
   * Callback for making the summary key
   */
  createPageSummary = () => {};

  setPdf = (pdfDoc) => {
    this.abstractAndTldrComponent.setPdf(pdfDoc);
  };
}

export { SummaryKeyComponent };
