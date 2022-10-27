import {AppComponents} from "./src/components/app-components-definition";
import {FileUpload} from "./src/file-upload";
import {AppLoader} from './src/app-loader';
import {PdfReader} from "./src/pdf-reader";
import {EventBus, PDFLEvents} from './src/event-bus';


const fileUpload = new FileUpload(AppComponents.uploadViewComponents);

var reader = undefined;

/**
 * Subscribe for a new file uploaded
 */
EventBus.subscribe(PDFLEvents.onFileUploaded, (pdfData) => {
    appLoader.showReader();
    if (reader === undefined) {
        reader = new PdfReader(AppComponents.readerViewComponents);
    } else {
        reader.initReader();
    }
    reader.loadPdf(pdfData);
});

/**
 * Subscriber for global app state change
 */
EventBus.subscribe(PDFLEvents.onAppStateChange,(state) => {
    if (state === 'empty'){
        fileUpload.registerEvents();
    } else if( state === 'reader') {
        fileUpload.removeEvents();
    }
});

/**
 * Subscriber for a new file request
 */
EventBus.subscribe(PDFLEvents.onNewFile, () => {
    appLoader.initView();
});

/**
 * Subscriber for error
 */
EventBus.subscribe(PDFLEvents.onPdfReaderError, (error) => {
    console.log(error);
});


//Last thing to call -> it's the entry point
const appLoader = new AppLoader(AppComponents.viewContainers);
