import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";

/**
 * Component representing the loader in side page. It can be used when data from
 * asynchronous function is being displayed in side page. If error occurs while
 * retrieving data from asynchronous function this component can also display
 * error message.
 * @property {Object} components object that holds DOM elements within this component
 * @property {HTMLElement} components.loader placeholder for loader animation or error message
 * @property {HTMLElement} components.loaderAnimation loading animation element
 * @property {HTMLElement} components.errorMessageDiv error message element
 */
class SidePageLoaderComponent {
  components = {
    loaderAnimation: document.querySelector("#loader-bubbles"),
    loader: document.querySelector("#side-page-loader"),
    errorMessageDiv: document.querySelector("#error-message-div"),
  };

  /**
   * Creates and initializes new side page loader component.
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * Registers events for showing or hiding loader or error message.
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(PDFLEvents.onHideSidePageLoader, () => {
      this.hideLoader();
    });

    EventHandlerService.subscribe(
      PDFLEvents.onShowTransparentSidePageLoader,
      () => {
        this.#showTransparentLoader();
      }
    );

    EventHandlerService.subscribe(PDFLEvents.onShowOpaqueSidePageLoader, () => {
      this.#showOpaqueLoader();
    });

    EventHandlerService.subscribe(PDFLEvents.onShowSidePageError, () => {
      this.#showErrorDisplay();
    });
  };

  /**
   * Hides all elements in component.
   */
  hideLoader() {
    this.components.loader.classList.add("hidden");
  }

  /**
   * Shows loader with transparent background.
   * @private
   */
  #showTransparentLoader() {
    this.#showLoader();
    this.components.loader.classList.add("transparent");
  }

  /**
   * Shows loader with transparent background.
   * @private
   */
  #showOpaqueLoader() {
    this.#showLoader();
    this.components.loader.classList.remove("transparent");
  }

  /**
   * Shows generic loader with no background specified.
   * @private
   */
  #showLoader() {
    this.#hideErrorDisplay();
    this.components.loaderAnimation.classList.remove("hidden");
    this.components.loader.classList.remove("hidden");
  }

  /**
   * Hides error message.
   */
  #hideErrorDisplay() {
    this.components.errorMessageDiv.classList.add("hidden");
    this.components.loader.classList.remove("error");
  }

  /**
   * Shows error message and hides loader.
   */
  #showErrorDisplay() {
    this.components.loader.classList.remove("hidden");
    this.components.loader.classList.add("error");
    this.components.loaderAnimation.classList.add("hidden");
    this.components.errorMessageDiv.classList.remove("hidden");
  }
}

export { SidePageLoaderComponent };
