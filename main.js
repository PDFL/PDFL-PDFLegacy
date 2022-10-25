
import {FileUpload} from "./components/file-upload";
import {AppLoader} from  './components/app-loader';
import {PdfReader} from "./components/pdf-reader";


const viewContainers = {
    uploadPage: document.getElementById('welcome-page'),
    readerView: document.getElementById("pdf-viewer")
}

const readerViewComponents = {
    pageNum: document.querySelector('#page_num'),
    pageCount: document.querySelector('#page_count'),
    currentPage: document.querySelector('#current_page'),
    previousPage: document.querySelector('#prev_page'),
    nextPage: document.querySelector('#next_page'),
    zoomIn: document.querySelector('#zoom_in'),
    zoomOut: document.querySelector('#zoom_out'),
    pdfContainer: document.querySelector('#pdf_container')
}

const uploadViewComponents = {
    dropArea: document.getElementById("file-drag"),
    fileOpen: document.getElementById("fileOpen")
}

const fileUpload = new FileUpload(uploadViewComponents,(pdfData) => {
    appLoader.showReader();
    const reader = new PdfReader(readerViewComponents);
    reader.onError = handleError;
    reader.loadPdf(pdfData);
});

const appLoader = new AppLoader(viewContainers,(state) => {
    console.log("State: " + state)
    if (state === 'empty'){
        fileUpload.registerEvents();
    } else if( state === 'reader') {
        fileUpload.removeEvents();
    }
});

function handleError(e) {
    console.log(e);
}
