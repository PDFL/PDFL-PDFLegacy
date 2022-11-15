import { EventHandlerService, PDFLEvents } from "../services/EventHandlerService";

/**
 * Component that takes in the PDF file that user uploads and processes it.
 * 
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.dropArea rectangle in which PDF file can be dropped to and uploaded 
 * @property {HTMLElement} components.fileOpen input element used for PDF file upload
 */
class FileUploadComponent {

    components = {
        dropArea: document.getElementById("file-drag"),
        fileOpen: document.getElementById("file-open"),
    }

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
        this.components.fileOpen.addEventListener('input', this.#onFileChange);
        this.components.dropArea.addEventListener('dragover', this.#onDragOver);
        this.components.dropArea.addEventListener('dragleave', this.#onDragLeave);
        this.components.dropArea.addEventListener('drop', this.#onDrop);
    }

    /**
     * Callback for file input.
     * @private
     * @param {Event} event event triggered on new file input
     */
    #onFileChange = (event) => {
        if (this.components.fileOpen.value == "") return;
        
        this.#readFile(event.target.files[0]);
        this.components.fileOpen.value = null;
    }

    /**
     * Callback for drag over event.
     * @private
     * @param {Event} event event triggered when file is dragged over file upload rectangle
     */
    #onDragOver = (event) => {
        event.target.setAttribute('drop-active', true);
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    /**
     * Callback for drag leave event.
     * @private
     * @param {Event} event event triggered when file is dragged out of file upload rectangle
     */
    #onDragLeave = (event) => {
        event.stopPropagation();
        event.preventDefault();
        event.target.removeAttribute('drop-active');
    }

    /**
     * Callback for drop event.
     * @private
     * @param {Event} event event triggered when file is dropped in file upload rectangle
     */
    #onDrop = (event) => {
        event.target.removeAttribute('drop-active');
        event.stopPropagation();
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        this.#readFile(file);
    }

    /**
     * Function to read and return the data of the selected/dropped file.
     * @private
     * @param {File} file uploaded PDF file
     */
    #readFile = (file) => {
        EventHandlerService.publish(PDFLEvents.onResetReader);
        
        const fileReader = new FileReader();
        fileReader.onload = function () {
            EventHandlerService.publish(PDFLEvents.onReadNewFile, new Uint8Array(this.result));
            EventHandlerService.publish(PDFLEvents.onShowReaderView);
        };
        fileReader.readAsArrayBuffer(file);
    }

}

export { FileUploadComponent };