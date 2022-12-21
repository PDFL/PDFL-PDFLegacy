import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
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
   * Set number of click to zero for handle the number of click on the summaryKeyBtn
   *
   * @constructor
   */
  constructor() {
    this.numberOfClick = 0;
    this.open = false;
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

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key, code) => {
        if (functionalKeys.ctrl && key === "y") {
          if (!this.open) {
            this.#showSidePageSummary();
            this.open = true;
          } else {
            this.#hideSidePageSummary();
            this.open = false;
          }
        }
      }
    );
  };

  /**
   * Callback for making a component visible. Iterate over all item with class "accordion"
   * @private
   */
  #showSidePageSummary = () => {
    let component = this.components;
    this.open = true;
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
    this.open = false;
    this.numberOfClick = 0;
    this.components.sidePageSummary.className = "hidden";
    this.components.closeBtn.className = "hidden";
  };
}

export { SummaryKeyComponent };
