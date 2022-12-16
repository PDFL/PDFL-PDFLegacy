/**
 * Component responsible for displaying the sidebar for summaries/key
 *
 */

class SummaryKeyComponent {
  components = {
    summaryKeyBtn: document.querySelector("#summary-maker"),
    sidePageSummary: document.querySelector("#side-page-summary"),
    accordionItem: document.getElementsByClassName("accordion"),
    closeBtn: document.querySelector("#close-btn-summary"),
    graphMakerBtn: document.querySelector("#graph-maker"),
    referenceOpenBtn: document.querySelector("#side-page-reference-btn"),
    numberOfClick: 0,
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
    this.components.closeBtn.addEventListener(
      "click",
      this.#hideSidePageSummary
    );
    this.components.graphMakerBtn.addEventListener(
      "click",
      this.#hideSidePageSummary
    );
  };

  /**
   * Callback for making a component visible. Iterate over all item with class "accordion"
   * @private
   */
  #showSidePageSummary = () => {
    let component = this.components;
    console.log(component.numberOfClick);
    if (component.numberOfClick % 2 == 0) {
      component.sidePageSummary.className = "one-third-width";
      component.closeBtn.className = "closebtn";
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
    } else {
      component.sidePageSummary.className = "no-width";
      component.closeBtn.className = "hidden";
    }
    component.numberOfClick++;
  };

  #hideSidePageSummary = () => {
    this.components.numberOfClick = 0;
    this.components.sidePageSummary.className = "no-width";
    this.components.closeBtn.className = "hidden";
  };
}

export { SummaryKeyComponent };
