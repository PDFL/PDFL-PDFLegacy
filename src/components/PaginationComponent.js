import { EventHandlerService, PDFLEvents } from "../services/EventHandlerService";

class PaginationComponent {

    components = {
        pageNum: document.querySelector('#page_num'),
        pageCount: document.querySelector('#page_count'),
        currentPage: document.querySelector('#current_page'),
        previousPage: document.querySelector('#prev_page'),
        nextPage: document.querySelector('#next_page'),
    }

    constructor() {
        this.setPageCount(0);
        this.setCurrentPage(1);

        this.#registerEvents();
    }

    #registerEvents = () => {
        this.components.previousPage.addEventListener('click', this.#showPrevPage);
        this.components.nextPage.addEventListener('click', this.#showNextPage);
        this.components.currentPage.addEventListener('keypress', this.#currentPageKeypress);
    }

    /**
    * Callback for the previous page event. Render the previous page of the current one if available
    */
    #showPrevPage = () => {
        if (this.currentPage <= 1) return;
        this.currentPage--;

        this.#currentPageChanged();
    };

    /**
     * Callback for the next page event. Render the next page of the current one if available
     */
    #showNextPage = () => {
        if (this.currentPage >= this.pageCount) return;
        this.currentPage++;

        this.#currentPageChanged();
    };

    /**
     * Callback for page number input listener. Render the given page if available
     * @param event
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

    #currentPageChanged = () => {
        this.components.currentPage.value = this.currentPage;
        EventHandlerService.publish(PDFLEvents.onRenderPage);
    }

    setPageCount = (pageNumber) => {
        this.pageCount = pageNumber;
        this.components.pageCount.textContent = pageNumber;
    }

    setCurrentPage = (pageNumber = this.currentPage) => {
        this.currentPage = pageNumber;
        this.components.pageNum.textContent = pageNumber;
        this.components.currentPage.value = pageNumber;
    }

    getCurrentPage = () => {
        return this.currentPage;
    }

}

export { PaginationComponent };