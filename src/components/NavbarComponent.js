import { POPUP_DISAPPEAR_TIMEOUT } from "../Constants";
import { readFile } from "../services/FileUploadService";

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
   * Adds event listeners to new pdf button
   * @private
   */
  #registerEvents = () => {
    //this.components.openNew.addEventListener("input", this.#onNewFile);
  };

  /**
   * Call back for checking file format and read it. If the file is not a pdf an error message is displayed
   * @private
   */
  #onNewFile = (event) => {
    if (event.target.files[0].type === "application/pdf") {
      this.#showLoader();
      this.#hideErrorMessage();
      readFile(event.target.files[0]);
    } else {
      this.#showErrorMessage();
    }
  };

  /**
   * Hide error message
   * @private
   */
  #hideErrorMessage = () => {
    this.components.errorMessage.classList.add("hidden");
  };

  /**
   * Show error message
   * @private
   */
  #showErrorMessage = () => {
    clearTimeout(messageErrorTimeOut);
    this.components.errorMessage.classList.remove("hidden");
    var messageErrorTimeOut = setTimeout(() => {
      this.hideErrorMessage();
    }, POPUP_DISAPPEAR_TIMEOUT);
  };

  /**
   * Show loader
   * @private
   */
  #showLoader = () => {
    this.components.loader.classList.remove("hidden");
  };
}

export { NavbarComponent };
