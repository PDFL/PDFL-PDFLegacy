import { InputView } from "./views/InputView.js";
import { ReaderView } from "./views/ReaderView.js";
import { WelcomeView } from "./views/WelcomeView.js";
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
        this.#showWelcomeView();
    }

    #registerEvents = () => {
        EventHandlerService.subscribe(PDFLEvents.onShowInputView, () => {
            this.#showInputView();
        });
        EventHandlerService.subscribe(PDFLEvents.onShowReaderView, () => {
            this.#showReaderView();
        });
    }

    /**
     * Initialize the view, show the welcome page
     */
    #showWelcomeView = () => {
        this.view = new WelcomeView();
        this.view.init();
    }


    /**
     * Switch from welcome page to input view, show the file uploader and hide the reader
     */
     #showInputView = () => {
        this.view = new InputView();
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