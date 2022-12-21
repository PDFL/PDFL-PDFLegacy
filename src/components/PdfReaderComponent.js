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
import { Page } from "./Page";
import { respondToVisibility } from "../services/Utils";

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
 * @property {Page[]} pages
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
    this.pages = [];
    this.visiblePage = null;
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

    EventHandlerService.subscribe(PDFLEvents.onRenderPage, (page) => {
      this.pages[page - 1].getCanvas().scrollIntoView();
      this.visibleCanvases = [page];
      this.#setVisiblePage(page);
    });

    EventHandlerService.subscribe(PDFLEvents.onZoomChange, (zoomScale) => {
      textRenderService
        .getPageSize(this.pdfDoc, zoomScale)
        .then(([width, height]) => {
          this.#setCanvasSize(width, height);
          let visiblePageNum = Math.min(...this.visibleCanvases);
          this.#setVisiblePage(visiblePageNum, true);
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
    this.pages = [];
    this.visiblePage = null;
  };

  /**
   * TODO: move repondToVisibility somewhere else
   */
  #createCanvases = () => {
    this.components.pdfContainer.innerHTML = "";

    for (let i = 0; i < this.pdfDoc.numPages; ++i) {
      let page = new Page(i + 1, this.pdfDoc);
      let canvas = page.getCanvas();
      this.pages.push(page);

      this.components.pdfContainer.appendChild(canvas);
    }

    textRenderService.getPageSize(this.pdfDoc, 1).then(([width, height]) => {
      this.#setCanvasSize(width, height);

      for (let i = 0; i < this.pdfDoc.numPages; ++i) {
        let page = this.pages[i];
        let canvas = page.getCanvas();

        respondToVisibility(canvas, (visible) => {
          if (visible) {
            this.visibleCanvases.push(i + 1);

            let visiblePageNum = Math.min(...this.visibleCanvases);
            this.#setVisiblePage(visiblePageNum);
          } else {
            let index = this.visibleCanvases.indexOf(i + 1);
            if (index != -1) {
              this.visibleCanvases.splice(index, 1);
            }
            this.visiblePageNum = Math.min(...this.visibleCanvases);
            this.toolbarComponent.setCurrentPage(this.visiblePageNum);
          }
        });
      }
    });
  };

  #renderPages = (pageNum, force) => {
    const NUMBER = 1;
    let zoom = this.toolbarComponent.getZoom();

    for (let i = pageNum - NUMBER; i <= pageNum + NUMBER; ++i) {
      let page = this.pages[i];
      if (page) {
        page.render(zoom, force);
      }
    }
  };

  #setCanvasSize(width, height) {
    this.pages.forEach((page) => page.setCanvasSize(width, height));
  }

  #setVisiblePage(pageNum, reRender = false) {
    if (pageNum == this.visiblePage && !reRender) {
      console.log("SAME PAGE SKIP");
      return;
    }
    this.visiblePage = pageNum;

    // TODO page change event
    this.#renderPages(pageNum, reRender);

    this.toolbarComponent.setCurrentPage(pageNum);
  }
}

export { PdfReaderComponent };
