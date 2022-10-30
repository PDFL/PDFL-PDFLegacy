export const AppComponents = {
    viewContainers : {
        uploadPage: document.getElementById('welcome-page'),
        readerView: document.getElementById("pdf-viewer")
    },
    readerViewComponents : {
        navigation: {
            pageNum: document.querySelector('#page_num'),
            pageCount: document.querySelector('#page_count'),
            currentPage: document.querySelector('#current_page'),
            previousPage: document.querySelector('#prev_page'),
            nextPage: document.querySelector('#next_page')
        },
        zoom: {
            zoomIn: document.querySelector('#zoom_in'),
            zoomOut: document.querySelector('#zoom_out')
        },
        pdfContainer: document.querySelector('#pdf_container'),
        openNew: document.querySelector('#open_new')
    },
    uploadViewComponents : {
        dropArea: document.getElementById("file-drag"),
        fileOpen: document.getElementById("fileOpen")
    }
}