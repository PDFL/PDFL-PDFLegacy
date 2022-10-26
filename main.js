const pdfjsLib = require("pdfjs-dist");
pdfjsLib.GlobalWorkerOptions.workerSrc = "webpack/pdf.worker.bundle.js";

const pdf = 'testpdf.pdf';

let pdfDoc = null;
pdfjsLib.getDocument(pdf).promise.then((data) => {
    pdfDoc = data;
    document.querySelector("page-number").setAttribute("maxPageNumber", pdfDoc._pdfInfo.numPages);
    document.querySelector("#page_count").textContent = pdfDoc._pdfInfo.numPages;
    renderPage(1, 1);
}).catch((err) => {
    alert(err.message);
});

let PAGE_NUM;
let ZOOM_SCALE;

const renderPageWithNumber = (pageNumber) => {
    if (pdfDoc === null) return;
    renderPage(pageNumber, ZOOM_SCALE);
}

const renderPageWithZoom = (zoom) => {
    if (pdfDoc === null) return;
    renderPage(PAGE_NUM, zoom);
}

const renderPage = (pageNumber, zoomFactor) => {
    PAGE_NUM = pageNumber;
    ZOOM_SCALE = zoomFactor;

    // Load the first page.
    pdfDoc
        .getPage(pageNumber)
        .then((page) => {
            const canvas = document.querySelector('#canvas');
            const ctx = canvas.getContext('2d');
            const viewport = page.getViewport({
                scale: zoomFactor,
            });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render the PDF page into the canvas context.
            const renderCtx = {
                canvasContext: ctx,
                viewport: viewport,
            };

            page.render(renderCtx);
        });
};

const currPageNumber = document.querySelector("#current_page");
currPageNumber.addEventListener("keypress", (event) => {
    const keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode != 13) return;

    renderPageWithNumber(currPageNumber.valueAsNumber);
});

const prev_page = document.querySelector("#prev_page");
prev_page.addEventListener("click", () => {
    renderPageWithNumber(currPageNumber.valueAsNumber);
});

const next_page = document.querySelector("#next_page");
next_page.addEventListener("click", () => {
    renderPageWithNumber(currPageNumber.valueAsNumber);
});

const zoomButtons = document.querySelector("zoom-buttons");
zoomButtons.addEventListener("click", () => {
    renderPageWithZoom(parseFloat(zoomButtons.getAttribute('zoomFactor')));
});