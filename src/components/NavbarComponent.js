import { POPUP_DISAPPEAR_TIMEOUT } from "../Constants";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

/**
 * Component that takes in the PDF file that user uploads and processes it.
 *
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.openNew button to click for upload a new pdf from the reader component
 * @property {HTMLElement} components.loader loader for showing the pdf uploaded
 * @property {HTMLElement} components.errorMessage error message for a wrong pdf uploaded from the pdf reader component
 */
class NavbarComponent {
  components = {
    openNew: document.querySelector("#open-new-pdf"),
    loader: document.querySelector("#loader"),
    errorMessage: document.querySelector(
      "#message-wrong-type-fileupload-reader"
    ),
  };

  /**
   * Creates and initializes navbar component.
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * Adds event listeners to ioeb a new pdf button from the pdf reader component and the shortcuts
   * @private
   */
  #registerEvents = () => {
    this.components.openNew.addEventListener("input", this.#onNewFile);

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key) => {
        if (!functionalKeys.ctrl) {
          return;
        }
        if (key === "u") {
          this.#onNewFile();
        }
      }
    );
  };

  /**
   * Creates event triggered when user click on the upload button from the pdf reader component
   * @private
   */
  #onNewFile = (event) => {
    if (event.target.files[0].type === "application/pdf") {
      this.showLoader();
      this.hideErrorMessage();
      EventHandlerService.publish(PDFLEvents.onResetReader);
      this.#readNewPdf(event.target.files[0]);
    } else {
      this.showErrorMessage();
    }
  };

  #readNewPdf = (newPdf) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
      EventHandlerService.publish(
        PDFLEvents.onReadNewFile,
        new Uint8Array(this.result)
      );
      EventHandlerService.publish(PDFLEvents.onShowReaderView);
      document.querySelector("#loader").classList.add("hidden");
    };
    fileReader.readAsArrayBuffer(newPdf);
  };

  /**
   * Callback for making the error message for the wrong file uploaded not visible.
   */
  hideErrorMessage = () => {
    this.components.errorMessage.classList.add("hidden");
  };

  /**
   * Callback for making the error message for the wrong file uploaded visible.
   */
  showErrorMessage = () => {
    clearTimeout(messageErrorTimeOut);
    this.components.errorMessage.classList.remove("hidden");
    var messageErrorTimeOut = setTimeout(() => {
      this.hideErrorMessage();
    }, POPUP_DISAPPEAR_TIMEOUT);
  };

  /**
   * Callback for making the loader visible.
   */
  showLoader = () => {
    this.components.loader.classList.remove("hidden");
  };
}

export { NavbarComponent };
