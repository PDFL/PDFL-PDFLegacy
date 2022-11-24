import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { SidePageComponent } from "./SidePageComponent";
import { ToolbarComponent } from "./ToolbarComponent";

const pdfjsLib = require("pdfjs-dist");

/**
 * Component representing the PDF reader. Displays the content of PDF document and actions
 * that can be applied to the document in the reader.
 *
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.pdfContainer element containing the PDF reader
 * @property {HTMLElement} components.openNew button that takes user to input view page
 * @property {SidePageComponent} sidePageComponent side component within the reader
 * @property {ToolbarComponent} toolbarComponent toolbar component within the reader
 * @property {PDFDocumentProxy} pdfDoc PDF document
 */
class PdfReaderComponent {
  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    openNew: document.querySelector("#open-new"),
    loader: document.querySelector("#loader"),
  };

  /**
   * Creates and initializes new zoom component. Creates new ToolbarComponent and
   * SidePageComponent objects.
   * @constructor
   */
  constructor() {
    this.toolbarComponent = new ToolbarComponent();
    this.sidePageComponent = new SidePageComponent();

    this.#registerEvents();
  }

  /**
   * Adds event listeners to component and it's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.openNew.addEventListener("click", this.#onNewFile);

    EventHandlerService.subscribe(PDFLEvents.onRenderPage, () => {
      this.#renderPage();
    });

    EventHandlerService.subscribe(PDFLEvents.onResetReader, () => {
      this.reset();
    });

    EventHandlerService.subscribe(PDFLEvents.onReadNewFile, (pdf) => {
      this.loadPdf(pdf);
    });
  };

  /**
   * Cretes event triggered when application view changed from reader view to input view.
   * @private
   */
  #onNewFile = () => {
    EventHandlerService.publish(PDFLEvents.onShowInputView);
  };

  /**
   * Load and render the first page of the given pdf.
   * @param {Uint8Array} pdf data, filename or url of a PDF document
   */
  loadPdf = (pdf) => {
    const self = this;
    pdfjsLib.GlobalWorkerOptions.workerSrc = "webpack/pdf.worker.bundle.js";
    pdfjsLib
      .getDocument(pdf)
      .promise.then((data) => {
        self.pdfDoc = data;
        self.toolbarComponent.setPageCount(data.numPages);
        self.sidePageComponent.setPDF(data);
        self.#renderPage();
      })
      .catch((err) => {
        console.log(err.message); // TODO: handle error in some way
      });
    this.components.loader.className += " hidden";
  };

  /**
   * Renders the page.
   * @private
   */
  #renderPage = () => {
    const self = this;
    this.pdfDoc.getPage(self.toolbarComponent.getCurrentPage()).then((page) => {
      //Set the HTML properties
      const canvas = document.createElement("canvas");
      canvas.setAttribute("class", "canvas__container");
      const textLayer = document.createElement("div");
      textLayer.setAttribute("class", "textLayer");
      const ctx = canvas.getContext("2d");
      const viewport = page.getViewport({
        scale: self.toolbarComponent.getZoom(),
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

      self.toolbarComponent.setCurrentPage();
    });
  };

  /**
   * Sets current page of pagination component to 1 and current zoom level
   * of zoom component to 1.
   */
  reset = () => {
    this.sidePageComponent.hideSidePage();
    this.toolbarComponent.reset();
  };
}

export { PdfReaderComponent };
