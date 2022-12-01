import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

/**
 * Component that paginates the PDF document that is being read. It calculates next/previous page number
 * and stores current and maximum page number of PDF document. This component displays labels for current
 * and maximum page number, together with previous/next page buttons.
 *
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.pageNum element that displays current page number
 * @property {HTMLElement} components.pageCount element that displays maximum page number
 * @property {HTMLElement} components.currentPage input element for desired page number
 * @property {HTMLElement} components.previousPage previous page button
 * @property {HTMLElement} components.nextPage next page button
 * @property {int} currentPage current page number value
 * @property {int} pageCount maximum page number value
 */
class PaginationComponent {
  components = {
    pageNum: document.querySelector("#page-num"),
    pageCount: document.querySelectorAll("#page-count"),
    currentPage: document.querySelector("#current-page"),
    previousPage: document.querySelector("#prev-page"),
    nextPage: document.querySelector("#next-page"),
  };

  /**
   * Creates and initializes new pagination component. Sets maximum page number to 0 and current
   * page number to 1.
   * @constructor
   */
  constructor() {
    this.setPageCount(0);
    this.setCurrentPage(1);

    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements.
   * @private
   */
  #registerEvents = () => {
    const self = this;
    this.components.previousPage.addEventListener("click", this.#showPrevPage);
    this.components.nextPage.addEventListener("click", this.#showNextPage);
    this.components.currentPage.addEventListener(
      "keypress",
      this.#currentPageKeypress
    );
    EventHandlerService.subscribe(
      PDFLEvents.onNewPageRequest,
      function (pageNumber) {
        self.setCurrentPage(pageNumber);
        EventHandlerService.publish(PDFLEvents.onRenderPage);
      }
    );
    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      this.#handleKeyboardKeyPressAction.bind(this)
    );
  };
  /**
   * Callback for global keyboard keyUp event
   * On left arrow previews page, right arrow nex page
   * @param functionalKey, object {ctrl: bool, alt: bool, shift: bool} indicates if one or more of this keys are pressed
   * @param key the actual key which triggers the event
   */
  #handleKeyboardKeyPressAction = (functionalKey, key) => {
    if (key === 39) {
      this.#showNextPage();
    } else if (key === 37) {
      this.#showPrevPage();
    }
  };

  /**
   * Callback for the previous page event. Render the previous page of the current one if available
   * @private
   */
  #showPrevPage = () => {
    if (this.currentPage <= 1) return;
    this.currentPage--;

    this.#currentPageChanged();
  };

  /**
   * Callback for the next page event. Render the next page of the current one if available.
   * @private
   */
  #showNextPage = () => {
    if (this.currentPage >= this.pageCount) return;
    this.currentPage++;

    this.#currentPageChanged();
  };

  /**
   * Callback for page number input listener. Render the given page if available.
   * @private
   * @param {Event} event event triggered on page number change
   */
  #currentPageKeypress = (event) => {
    const keycode = event.keyCode ? event.keyCode : event.which;

    if (keycode === 13) {
      // Get the new page number and render it.
      let desiredPage = this.components.currentPage.valueAsNumber;
      this.currentPage = Math.min(Math.max(desiredPage, 1), this.pageCount);

      this.components.pageNum.textContent = this.currentPage;
      this.#currentPageChanged();
    }
  };

  /**
   * Displays new page number and renders that page.
   * @private
   */
  #currentPageChanged = () => {
    this.components.currentPage.value = this.currentPage;
    EventHandlerService.publish(PDFLEvents.onRenderPage);
  };

  /**
   * Sets and displays new maximum page number.
   * @param {int} pageNumber new maximum page number
   */
  setPageCount = (pageNumber) => {
    this.pageCount = pageNumber;
    this.components.pageCount[0].textContent = pageNumber;
    this.components.pageCount[1].textContent = pageNumber;
  };

  /**
   * Sets and displays new current page number.
   * @param {int} pageNumber new current page number
   */
  setCurrentPage = (pageNumber = this.currentPage) => {
    this.currentPage = pageNumber;
    this.components.pageNum.textContent = pageNumber;
    this.components.currentPage.value = pageNumber;
  };

  /**
   * Getter for current page number.
   * @returns {int} current page number
   */
  getCurrentPage = () => {
    return this.currentPage;
  };
}

export { PaginationComponent };
