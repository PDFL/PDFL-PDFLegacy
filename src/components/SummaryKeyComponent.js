import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

/**
 * Component responsible for displaying the sidebar for summaries/key
 *
 */

class SummaryKeyComponent {
  components = {
    summaryKeyBtn: document.querySelector("#summary-maker"),
    sidePageSummary: document.querySelector("#side-page-summary"),
    accordionItem: document.getElementsByClassName("accordion"),
  };

  /**
   * Creates and initializes new Summary Key Component
   *
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.summaryKeyBtn.addEventListener(
      "click",
      this.#showSidePageSummary
    );
  };

  /**
   * Callback for making a component visible
   * @private
   */
  #showSidePageSummary = () => {
    let component = this.components;
    component.sidePageSummary.className = "one-third-width";
    for (var i = 0; i < component.accordionItem.length; i++) {
      component.accordionItem[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  };
}

export { SummaryKeyComponent };
