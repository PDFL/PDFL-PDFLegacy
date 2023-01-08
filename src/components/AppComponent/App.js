import { ReaderView } from "./views/ReaderView.js";
import { WelcomeView } from "./views/WelcomeView.js";
import { TutorialPageView } from "./views/TutorialPageView.js";
import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";

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
  };

  /**
   * Singleton constructor. Initializes application context.
   * @constructor
   */
  constructor() {
    if (App._instance) return App._instance;
    App._instance = this;

    this.#registerEvents();
    this.#showWelcomeView();
  }

  /**
   * Adds application listeners.
   * @private
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(PDFLEvents.onShowReaderView, () => {
      this.#showReaderView();
    });
    EventHandlerService.subscribe(PDFLEvents.onShowWelcomeView, () => {
      this.#showWelcomeView();
    });
    EventHandlerService.subscribe(PDFLEvents.onShowTutorialView, () => {
      this.#showTutorialView();
    });
  };

  /**
   * Initialize the view, show the welcome page
   * @private
   */
  #showWelcomeView = () => {
    this.view = new WelcomeView();
    this.view.init();
  };

  /**
   * Switch from the uploader view to the reader one
   */
  #showReaderView = () => {
    this.view = new ReaderView();
    this.view.init();
  };

  /**
   * Switch to Tutorial Page View
   */
  #showTutorialView = () => {
    this.view = new TutorialPageView();
    this.view.init();
  };
}

export { App };
