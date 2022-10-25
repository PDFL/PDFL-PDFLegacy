
import {FileUpload} from "./components/file-upload";
import {AppLoader} from  './components/app-loader';
import {PdfReader} from "./components/pdf-reader";

const fileUpload = new FileUpload((pdfData) => {
    appLoader.showReader();
    var reader = new PdfReader();
    reader.onError = handleError;
    reader.loadPdf(pdfData);
});

const appLoader = new AppLoader((state) => {
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