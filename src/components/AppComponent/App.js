import { DefaultView } from "./views/DefaultView.js";
import { ReaderView } from "./views/ReaderView.js";
import { EventHandlerService, PDFLEvents } from '../../services/EventHandlerService';

class App {

    static start = () => {
        return new App();
    }

    constructor() {
        if (App._instance)
            return App._instance;
        App._instance = this;

        this.#registerEvents();
    }

    #registerEvents = () => {
        EventHandlerService.subscribe(PDFLEvents.onShowDefaultView, () => {
            this.#showDefaultView();
        });
        EventHandlerService.subscribe(PDFLEvents.onShowReaderView, () => {
            this.#showReaderView();
        });
    }

    /**
     * Initialize the view, show the file uploader and hide the reader
     */
     #showDefaultView = () => {
        this.view = new DefaultView();
        this.view.init();
    }

    /**
     * Switch from the uploader view to the reader one
     */
     #showReaderView = () => {
        this.view = new ReaderView();
        this.view.init();
    }

}

export { App };