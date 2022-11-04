import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { PaginationComponent } from "./PaginationComponent";
import { ZoomComponent } from "./ZoomComponent";

const pdfjsLib = require("pdfjs-dist");

class PdfReaderComponent {
  components = {
    pdfContainer: document.querySelector("#pdf_container"),
    openNew: document.querySelector("#open_new"),
  };

  /**
   * @constructor
   */
  constructor() {
    this.paginationComponent = new PaginationComponent();
    this.zoomComponent = new ZoomComponent();

    this.#registerEvents();
  }

  /**
   * Add event listener to view elements of the toolbar
   */
  #registerEvents = () => {
    this.components.openNew.addEventListener("click", this.#onNewFile);

    EventHandlerService.subscribe(PDFLEvents.onRenderPage, () => {
      this.#renderPage();
    });
  };

  #onNewFile = () => {
    EventHandlerService.publish(PDFLEvents.onShowInputView);
  };

  /**
   * Load and render the first page of the given pdf
   * @param pdf data, filename or url of a PDF document
   */
  loadPdf = (pdf) => {
    const self = this;
    pdfjsLib.GlobalWorkerOptions.workerSrc = "webpack/pdf.worker.bundle.js";
    pdfjsLib
      .getDocument(pdf)
      .promise.then((data) => {
        self.pdfDoc = data;
        self.paginationComponent.setPageCount(data.numPages);
        self.#renderPage();
      })
      .catch((err) => {
        console.log(err.message); // TODO: handle error in some way
      });
  };

  /**
   * Private function, render the page
   */
  #renderPage = () => {
    const self = this;
    const loader = document.querySelector(".loader");
    this.pdfDoc
      .getPage(self.paginationComponent.getCurrentPage())
      .then((page) => {
        //Set the HTML properties
        const canvas = document.createElement("canvas");

        canvas.setAttribute("class", "canvas__container");
        const textLayer = document.createElement("div");
        textLayer.setAttribute("class", "textLayer");

        const ctx = canvas.getContext("2d");
        const viewport = page.getViewport({
          scale: self.zoomComponent.getZoom(),
        });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the PDF page into the canvas context.
        const renderCtx = {
          canvasContext: ctx,
          viewport: viewport,
        };

        var renderTask = page.render(renderCtx);

        renderTask.promise.then(function () {
          page.getTextContent().then(function (textContent) {
            textLayer.style.left = canvas.offsetLeft + "px";
            textLayer.style.top = canvas.offsetTop + "px";
            textLayer.style.height = canvas.offsetHeight + "px";
            textLayer.style.width = canvas.offsetWidth + "px";

            pdfjsLib.renderTextLayer({
              textContent: textContent,
              container: textLayer,
              viewport: viewport,
              textDivs: [],
            });
          });
        });

        page.render(renderCtx);

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
        }

        //Scroll is possible but not supported by other navigation functions, clear container before adding the new page
        self.components.pdfContainer.innerHTML = "";
        self.components.pdfContainer.appendChild(canvas);
        self.components.pdfContainer.appendChild(textLayer);

        self.paginationComponent.setCurrentPage();
        loader.className += " hidden"; // class "loader hidden"
      });
  };
}

export { PdfReaderComponent };
