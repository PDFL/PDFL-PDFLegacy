import { AppView } from "./AppView.js";
import {
  readFile,
  readFileFromUrl,
} from "../../../services/FileUploadService.js";
import {
  EventHandlerService,
  PDFLEvents,
} from "../../../services/EventHandlerService.js";

/**
 * Welcome page view.
 *
 * @extends AppView
 * @property {Object} components object that holds DOM elements that are within view
 * @property {HTMLElement} components.view element that represents welcome view
 * @property {HTMLElement} components.buttonFile button that takes user to file input page
 * @property {HTMLElement} components.dropArea rectangle in which PDF file can be dropped to and uploaded
 * @property {HTMLElement} components.fileOpen input element used for PDF file upload
 * @property {HTMLElement} components.buttonAbout button that opens about popup
 * @property {HTMLElement} components.panelTutorial element that represents the tutorial window for about view
 * @property {HTMLElement} components.aboutPopupView element which is a popup with text that represents about page view
 * @property {HTMLElement} components.buttonCloseAbout button that closes about popup
=======
 * @property {HTMLElement} components.errorMessage error message showed when the user try to upload a file that is not a pdf
 * @property {HTMLElement} components.tutorialPageBtn button that takes user to tutorial page

 */
class WelcomeView extends AppView {
  components = {
    view: document.getElementById("welcome-page"),
    buttonFile: document.getElementById("button-file"),
    dropArea: document.getElementById("file-drag"),
    fileOpen: document.getElementById("file-open"),
    errorMessage: document.getElementById("message-wrong-type-fileupload"),
    buttonAbout: document.getElementById("btn-about"),
    panelTutorial: document.getElementById("abt-tutorial"),
    aboutPopupView: document.getElementById("about-tutorial-window"),
    buttonCloseAbout: document.getElementById("close-about"),
    tutorialPageBtn: document.getElementById("tutorial-welcome-page"),
  };

  /**
   * Initializes welcome page view - shows current view and hides others.
   */
  init() {
    this.cleanView();
    this.components.view.hidden = false;
    this.#registerEvents();
    this.#checkForPdfAsUrl();
  }

  /**
   * Add event listeners for welcome view
   * @private
   */
  #registerEvents = () => {
    this.components.fileOpen.addEventListener("input", this.#onFileChange);
    this.components.dropArea.addEventListener("dragover", this.#onDragOver);
    this.components.dropArea.addEventListener("dragleave", this.#onDragLeave);
    this.components.dropArea.addEventListener("drop", this.#onDrop);
    this.components.buttonAbout.addEventListener("click", this.#openAbout);
    this.components.buttonCloseAbout.addEventListener("click", this.#closeAbout);
    this.components.tutorialPageBtn.addEventListener(
      "click",
      this.#showTutorialPage
    );
  };

  /**
   * Callback for file input.
   * @private
   * @param {Event} event event triggered on new file input
   */
  #onFileChange = (event) => {
    if (this.components.fileOpen.value == "") return;

    this.#readFile(event.target.files[0]);
    this.components.fileOpen.value = null;
  };

  /**
   * Callback for drag over event.
   * @private
   * @param {Event} event event triggered when file is dragged over file upload rectangle
   */
  #onDragOver = (event) => {
    event.target.setAttribute("drop-active", true);
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  /**
   * Callback for drag leave event.
   * @private
   * @param {Event} event event triggered when file is dragged out of file upload rectangle
   */
  #onDragLeave = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.target.removeAttribute("drop-active");
  };

  /**
   * Callback for drop event.
   * @private
   * @param {Event} event event triggered when file is dropped in file upload rectangle
   */
  #onDrop = (event) => {
    event.target.removeAttribute("drop-active");
    event.stopPropagation();
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    this.#readFile(file);
  };

  /**
   * Function to reads and returns the data of the selected/dropped file, displays error message otherwise.
   * @private
   * @param {File} file uploaded PDF file
   */
  #readFile = (file) => {
    if (file.type === "application/pdf") {
      readFile(file);
    } else {
      this.components.errorMessage.classList.remove("hidden");
    }
  };

  /**
   * Check if the url contains query 'url'. If it does it will load
   * the pdf from the external service.
   */
  #checkForPdfAsUrl = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    let pdfUrl = params.url;
    if (pdfUrl) {
      readFileFromUrl(pdfUrl);
    }
  };

  /**
   * Display about tutorial window
   * @private
   */
  #openAbout = () => {
    this.components.panelTutorial.style = "display:flex";
    this.components.aboutPopupView.classList.remove("hidden");
  };

  /**
   * Hides the background panel of the tutorial window and about popup window
   * @private
   */
  #closeAbout = () => {
    this.components.panelTutorial.style = "display:none";
    this.components.aboutPopupView.classList.add("hidden");

   * Triggers the onShowTutorialView event
   */
  #showTutorialPage = () => {
    EventHandlerService.publish(PDFLEvents.onShowTutorialView);
  };
}

export { WelcomeView };
