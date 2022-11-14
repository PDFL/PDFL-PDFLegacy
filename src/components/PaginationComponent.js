import { EventHandlerService, PDFLEvents } from "../services/EventHandlerService";

/**
 * Component that displays zoom previous/next page buttons, as well as current and maximum page 
 * number of PDF file. Calculates next/previous page number and stores it.
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
        pageNum: document.querySelector('#page_num'),
        pageCount: document.querySelector('#page_count'),
        currentPage: document.querySelector('#current_page'),
        previousPage: document.querySelector('#prev_page'),
        nextPage: document.querySelector('#next_page'),
    }

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
     * @private Private class method
     */
    #registerEvents = () => {
        this.components.previousPage.addEventListener('click', this.#showPrevPage);
        this.components.nextPage.addEventListener('click', this.#showNextPage);
        this.components.currentPage.addEventListener('keypress', this.#currentPageKeypress);
    }

    /**
    * Callback for the previous page event. Render the previous page of the current one if available
    * @private Private class method
    */
    #showPrevPage = () => {
        if (this.currentPage <= 1) return;
        this.currentPage--;

        this.#currentPageChanged();
    };

    /**
     * Callback for the next page event. Render the next page of the current one if available.
     * @private Private class method
     */
    #showNextPage = () => {
        if (this.currentPage >= this.pageCount) return;
        this.currentPage++;

        this.#currentPageChanged();
    };

    /**
     * Callback for page number input listener. Render the given page if available.
     * @private Private class method
     * @param {Event} event event triggered on page number change
     */
    #currentPageKeypress = (event) => {
        const keycode = event.keyCode ? event.keyCode : event.which;

        if (keycode === 13) {
            // Get the new page number and render it.
            let desiredPage = this.components.currentPage.valueAsNumber;
            this.currentPage = Math.min(
                Math.max(desiredPage, 1),
                this.pageCount
            );
            
            this.components.pageNum.textContent = this.currentPage;
            this.#currentPageChanged();
        }
    }

    /**
     * Displays new page number and renders that page.
     * @private Private class method
     */
    #currentPageChanged = () => {
        this.components.currentPage.value = this.currentPage;
        EventHandlerService.publish(PDFLEvents.onRenderPage);
    }

    /**
     * Sets and displays new maximum page number.
     * @param {int} pageNumber new maximum page number
     */
    setPageCount = (pageNumber) => {
        this.pageCount = pageNumber;
        this.components.pageCount.textContent = pageNumber;
    }

    /**
     * Sets and displays new current page number.
     * @param {int} pageNumber new current page number
     */
    setCurrentPage = (pageNumber = this.currentPage) => {
        this.currentPage = pageNumber;
        this.components.pageNum.textContent = pageNumber;
        this.components.currentPage.value = pageNumber;
    }

    /**
     * Getter for current page number.
     * @returns {int} current page number
     */
    getCurrentPage = () => {
        return this.currentPage;
    }

}

export { PaginationComponent };