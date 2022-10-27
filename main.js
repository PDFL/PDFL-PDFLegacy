import {FileUpload} from "./src/file-upload";
import {AppLoader} from './src/app-loader';
import {PdfReader} from "./src/pdf-reader";
import {EventBus, PDFLEvents} from './src/event-bus';


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
    pdfContainer: document.querySelector('#pdf_container'),
    openNew: document.querySelector('#open_new')
}

const uploadViewComponents = {
    dropArea: document.getElementById("file-drag"),
    fileOpen: document.getElementById("fileOpen")
}



const fileUpload = new FileUpload(uploadViewComponents,(pdfData) => {
    appLoader.showReader();
    const reader = new PdfReader(readerViewComponents);
    reader.loadPdf(pdfData);
});

EventBus.subscribe(PDFLEvents.onAppStateChange,(state) => {
    if (state === 'empty'){
        fileUpload.registerEvents();
    } else if( state === 'reader') {
        fileUpload.removeEvents();
    }
});

EventBus.subscribe(PDFLEvents.onNewFile, () => {
    appLoader.initView();
});

EventBus.subscribe(PDFLEvents.onPdfReaderError, (error) => {
    console.log(error);
});


//Last thing to call -> it's the entry point
const appLoader = new AppLoader(viewContainers);
