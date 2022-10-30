import {EventBus, PDFLEvents} from "./event-bus";

/**
 * This class is used to manage the upload of a pdf file from the local file system
 */
class FileUpload {
    /**
     * @constructor
     * @param viewComponents (object) src of the uploader view
     */
    constructor(viewComponents) {
        this.viewComponents = viewComponents;
    }

    /**
     * Add event listeners to upload view
     */
    registerEvents = () => {
       this.viewComponents.fileOpen.addEventListener('change', this.#onFileChange);
       this.viewComponents.dropArea.addEventListener('dragover', this.#onDragOver);
       this.viewComponents.dropArea.addEventListener('dragleave', this.#onDragLeave);
       this.viewComponents.dropArea.addEventListener('drop', this.#onDrop);
    }

    /**
     * Remove event listeners to upload view
     */
    removeEvents = () => {
        this.viewComponents.fileOpen.removeEventListener('change', this.#onFileChange, true);
        this.viewComponents.dropArea.removeEventListener('dragover', this.#onDragOver, true);
        this.viewComponents.dropArea.removeEventListener('dragleave', this.#onDragLeave, true);
        this.viewComponents.dropArea.removeEventListener('drop', this.#onDrop, true);
    }

    /**
     * Callback for file input
     * @param e
     */
    #onFileChange = (e) => {
        const file = e.target.files[0];
        this.#readFile(file);
    }

    /**
     * Callback for drag over event
     * @param e
     */
    #onDragOver = (e) => {
        e.target.setAttribute('drop-active', true);
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    /**
     * Callback for drag leave event
     * @param e
     */
    #onDragLeave = (e) => {
        e.stopPropagation();
        e.preventDefault();
        e.target.removeAttribute('drop-active');
    }

    /**
     * Callback for drop event
     * @param e
     */
    #onDrop = (e) => {
        e.target.removeAttribute('drop-active');
        e.stopPropagation();
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        this.#readFile(file);
    }

    /**
     * Function to read and return the data of the selected/dropped file
     * @param file
     */
    #readFile = (file) => {
        const self = this;
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            EventBus.publish(PDFLEvents.onFileUploaded, typedarray);
        };
        fileReader.readAsArrayBuffer(file);
    }
}

export {FileUpload};


