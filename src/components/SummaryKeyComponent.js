import { ToolbarComponent } from "./ToolbarComponent";
import { PopupComponent } from "./PopupComponent";

/**
 * Component responsible for displaying the sidebar for summaries/key
 *
 * @property {Object} components object that holds DOM elements that represent this component, as well as component's context
 * @property {HTMLElement} components.summaryKeyBtn button that open and close the sidepage
 * @property {HTMLElement} components.accordionItem accordion item
 * @property {HTMLElement} components.closeBtn button that closes sidepage
 *
 */

class SummaryKeyComponent {
  components = {
    summaryKeyBtn: document.querySelector("#summary-maker"),
    sidePageSummary: document.querySelector("#side-page-summary"),
    accordionItem: document.getElementsByClassName("accordion"),
    closeBtn: document.querySelector("#close-btn-summary"),
  };

  /**
   * Creates and initializes new Summary Key Component
   *
   * @constructor
   */
  constructor() {
    this.numberOfClick = 0;
    this.toolbarComponent = new ToolbarComponent();
    this.popupComponent = new PopupComponent();
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

    this.components.closeBtn.addEventListener(
      "click",
      this.#hideSidePageSummary
    );
    this.toolbarComponent.components.graphMakerBtn.addEventListener(
      "click",
      this.#hideSidePageSummary
    );
    this.popupComponent.components.sidePageReferenceBtn.addEventListener(
      "click",
      this.#hideSidePageSummary
    );

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
   * Callback for making a component visible. Iterate over all item with class "accordion"
   * @private
   */
  #showSidePageSummary = () => {
    let component = this.components;
    document.querySelector("#side-page").className = "hidden";
    if (this.numberOfClick % 2 === 0) {
      component.sidePageSummary.className = "one-third-width";
      component.closeBtn.className = "closebtn";
    } else {
      component.sidePageSummary.className = "hidden";
      component.closeBtn.className = "hidden";
    }
    this.numberOfClick++;
  };

  /**
   * Callback for making a component not visible.
   * @private
   */
  #hideSidePageSummary = () => {
    this.numberOfClick = 0;
    this.components.sidePageSummary.className = "hidden";
    this.components.closeBtn.className = "hidden";
  };
}

export { SummaryKeyComponent };
