import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { SidePageComponent } from "./SidePageComponent";
import { ToolbarComponent } from "./ToolbarComponent";
import { ReferenceComponent } from "./ReferenceComponent";
import { PopupComponent } from "./PopupComponent";
import { ReferenceViewComponent } from "./ReferenceViewComponent";
import { KeyboardService } from "../services/KeyboardService";
import * as textRenderService from "../services/TextRenderService";
import { findMiddleCanvas, respondToVisibility } from "../services/Utils";

const pdfjsLib = require("pdfjs-dist");

/**
 * Component representing the PDF reader. Displays the content of PDF document and actions
 * that can be applied to the document in the reader.
 *
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.pdfContainer element containing the PDF reader
 * @property {HTMLElement} components.openNew button that takes user to input view page
 * @property {HTMLElement} components.canvas canvas DOM element for pdf.js page
 * @property {import("pdfjs-dist").PageViewport} components.viewport target page viewport for the text layer
 * @property {SidePageComponent} sidePageComponent side component within the reader
 * @property {ToolbarComponent} toolbarComponent toolbar component within the reader
 * @property {PopupComponent} popupComponent popup component within the reader
 * @property {PDFDocumentProxy} pdfDoc PDF document
 * @property {KeyboardService} keyboardService keyboard service
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
    this.keyboardService = new KeyboardService();
    this.toolbarComponent = new ToolbarComponent();
    this.sidePageComponent = new SidePageComponent();
    this.referenceComponent = new ReferenceComponent();
    this.popupComponent = new PopupComponent();
    this.referenceViewComponent = new ReferenceViewComponent();
    this.visibleCanvases = [];
    this.pageWidth = null;
    this.pageHeight = null;
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component and it's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.openNew.addEventListener("click", this.#onNewFile);

    // this.components.pdfContainer.addEventListener(
    //   "mousemove",
    //   textRenderService.hideLinks
    // );

    // new ResizeObserver(() => {
    //   textRenderService.positionTextLayer(
    //     this.components.canvas,
    //     this.components.viewport
    //   );
    // }).observe(this.components.pdfContainer);

    EventHandlerService.subscribe(PDFLEvents.onRenderPage, () => {
      this.#renderPages();
    });

    EventHandlerService.subscribe(PDFLEvents.onZoomChange, () => {
      let zoomScale = this.toolbarComponent.getZoom();
      textRenderService
        .getPageSize(this.pdfDoc, zoomScale)
        .then(([width, height]) => {
          this.#setCanvasSize(width, height);
          this.#renderPages();
        });
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
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.bundle.js";
    pdfjsLib
      .getDocument(pdf)
      .promise.then((data) => {
        self.pdfDoc = data;
        self.referenceComponent.setPdfDoc(data);
        self.toolbarComponent.setPageCount(data.numPages);
        self.sidePageComponent.setPDF(data);

        self.referenceViewComponent.setPdfDoc(data);

        this.#createCanvases();
      })
      .catch((err) => {
        console.log(err.message); // TODO: handle error in some way
      });
    this.components.loader.className += " hidden";
  };

  /**
   * Sets current page of pagination component to 1 and current zoom level
   * of zoom component to 1.
   */
  reset = () => {
    this.sidePageComponent.hideSidePage();
    this.toolbarComponent.reset();
  };

  /**
   * TODO: move repondToVisibility somewhere else
   */
  #createCanvases = () => {
    this.components.pdfContainer.innerHTML = "";
    for (let i = 0; i < this.pdfDoc.numPages; ++i) {
      let canvas = document.createElement("canvas");
      canvas.setAttribute("id", `canvas-${i + 1}`);
      canvas.setAttribute("class", "canvas__container");

      respondToVisibility(canvas, (visible) => {
        let canvasId = canvas.id;
        if (visible) {
          this.visibleCanvases.push(canvasId);

          let visiblePageNum = this.#renderPages();
          this.toolbarComponent.setCurrentPage(visiblePageNum);
        } else {
          let index = this.visibleCanvases.indexOf(canvasId);
          if (index != -1) {
            this.visibleCanvases.splice(index, 1);
          }
        }
      });

      this.components.pdfContainer.appendChild(canvas);
    }
  };

  #setCanvasSize(width, height) {
    for (let i = 0; i < this.pdfDoc.numPages; ++i) {
      let canvas = document.querySelector(`#canvas-${i + 1}`);

      canvas.width = width;
      canvas.height = height;
    }
  }

  #renderPages = () => {
    let visiblePageNum = findMiddleCanvas(this.visibleCanvases);

    textRenderService.renderAround(
      this.pdfDoc,
      visiblePageNum,
      this.toolbarComponent.getZoom()
    );
    return visiblePageNum;
  };
}

export { PdfReaderComponent };
