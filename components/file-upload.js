class FileUpload {

    constructor(onFileReady) {
        this.dropArea = document.getElementById("file-drag");
        this.fileOpen = document.getElementById("fileOpen");
        this.onFileReady = onFileReady;
    }

    registerEvents = () => {
       this.fileOpen.addEventListener('change', this.#onFileChange);
       this.dropArea.addEventListener('dragover', this.#onDragOver);
       this.dropArea.addEventListener('dragleave', this.#onDragLeave);
       this.dropArea.addEventListener('drop', this.#onDrop);
    }

    removeEvents = () => {
        this.fileOpen.removeEventListener('change', this.#onFileChange, true);
        this.dropArea.removeEventListener('dragover', this.#onDragOver, true);
        this.dropArea.removeEventListener('dragleave', this.#onDragLeave, true);
        this.dropArea.removeEventListener('drop', this.#onDrop, true);
    }

    #onFileChange = (e) => {
        var file = e.target.files[0];
        this.#readFile(file);
    }

    #onDragOver = (e) => {
        e.target.setAttribute('drop-active', true);
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    #onDragLeave = (e) => {
        e.stopPropagation();
        e.preventDefault();
        e.target.removeAttribute('drop-active');
    }

    #onDrop = (e) => {
        e.target.removeAttribute('drop-active');
        e.stopPropagation();
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        this.#readFile(file);
    }

    #readFile = (file) => {
        var self = this;
        var fileReader = new FileReader();
        fileReader.onload = function() {
            var typedarray = new Uint8Array(this.result);
            self.onFileReady(typedarray);
        };
        fileReader.readAsArrayBuffer(file);
    }
}

exports.FileUpload = FileUpload;


