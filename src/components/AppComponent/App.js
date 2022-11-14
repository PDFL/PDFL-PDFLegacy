import { InputView } from "./views/InputView.js";
import { ReaderView } from "./views/ReaderView.js";
import { WelcomeView } from "./views/WelcomeView.js";
import { EventHandlerService, PDFLEvents } from '../../services/EventHandlerService';

/**
 * Singleton class representing the single page application.
 * 
 * @property {AppView} view current displayed application view
 */
class App {

    /**
     * Starts the applications - creates new App object.
     * @returns {App}
     */
    static start = () => {
        return new App();
    }

    /**
     * Singleton constructor. Initializes application context.
     * @constructor
     */
    constructor() {
        if (App._instance)
            return App._instance;
        App._instance = this;

        this.#registerEvents();
        this.#showWelcomeView();
    }

    /**
     * Adds application listeners.
     * @private Private class method
     */
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
     * @private Private class method
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