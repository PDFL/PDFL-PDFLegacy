import {EventBus, PDFLEvents} from "../event-bus";

class PageNavigatorComponent {
    
    constructor(viewComponents, readerState) {
        this.viewComponents = viewComponents;
        this.readerState = readerState;
        this.#setListener();
    }
    
    
    #setListener = () => {
        this.viewComponents.previousPage.addEventListener('click', this.#showPrevPage.bind(this));
        this.viewComponents.nextPage.addEventListener('click', this.#showNextPage.bind(this));
        this.viewComponents.currentPage.addEventListener('keypress', this.#currentPageKeypress.bind(this));
    }

    /**
     * Callback for the previous page event. Render the previous page of the current one if available
     */
    #showPrevPage = () => {
        if (this.readerState.document === null || this.readerState.currentPage <= 1)
            return;
        this.readerState.currentPage--;
        this.viewComponents.currentPage.value = this.readerState.currentPage;
        EventBus.publish(PDFLEvents.onRenderRequest);
    };

    /**
     * Callback for the next page event. Render the next page of the current one if available
     */
    #showNextPage = () => {
        if (this.readerState.document === null || this.readerState.currentPage >= this.readerState.document._pdfInfo.numPages)
            return;

        this.readerState.currentPage++;
        this.viewComponents.currentPage.value = this.readerState.currentPage;
        EventBus.publish(PDFLEvents.onRenderRequest);
    };

    /**
     * Callback for page number input listener. Render the given page if available
     * @param event
     */
    #currentPageKeypress = (event) => {
        if (this.readerState.document === null) return;
        // Get the key code.
        const keycode = event.keyCode ? event.keyCode : event.which;

        if (keycode === 13) {
            // Get the new page number and render it.
            let desiredPage = this.viewComponents.currentPage.valueAsNumber;
            this.readerState.currentPage = Math.min(
                Math.max(desiredPage, 1),
                this.readerState.document._pdfInfo.numPages,
            );

            this.viewComponents.currentPage.value = this.readerState.currentPage;
            EventBus.publish(PDFLEvents.onRenderRequest);
        }
    }
}

export {PageNavigatorComponent}