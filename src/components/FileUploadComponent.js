import { POPUP_DISAPPEAR_TIMEOUT } from "../Constants";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

/**
 * Component that takes in the PDF file that user uploads and processes it.
 *
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.dropArea rectangle in which PDF file can be dropped to and uploaded
 * @property {HTMLElement} components.fileOpen input element used for PDF file upload
 */
class FileUploadComponent {
  components = {
    openNew: document.getElementById("open-another"),
    loader: document.querySelector("#loader"),
    errorMessage: document.getElementById(
      "message-wrong-type-fileupload-reader"
    ),
  };

  /**
   * Creates and initializes new file upload component.
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements.
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
   * Cretes event triggered when application view changed from reader view to input view.
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
   * Callback for making a component not visible.
   */
  hideErrorMessage = () => {
    this.components.errorMessage.classList.add("hidden");
  };

  /**
   * Callback for making a component visible.
   */
  showErrorMessage = () => {
    clearTimeout(messageErrorTimeOut);
    this.components.errorMessage.classList.remove("hidden");
    var messageErrorTimeOut = setTimeout(() => {
      this.hideErrorMessage();
    }, POPUP_DISAPPEAR_TIMEOUT);
  };

  /**
   * Callback for making a component visible.
   */
  showLoader = () => {
    this.components.loader.classList.remove("hidden");
  };
}

export { FileUploadComponent };
