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
  components = {};

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
  #registerEvents = () => {};
}

export { FileUploadComponent };
