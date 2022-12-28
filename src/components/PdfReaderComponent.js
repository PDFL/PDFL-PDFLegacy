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
import { PdfPageComponent } from "./PdfPageComponent";
import { respondToVisibility } from "../services/Utils";
import { EXTRA_PAGES_TO_RENDER } from "../Constants";
import { SelectionPopUpComponent } from "./SelectionPopUpComponent";

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
 * @property {PdfPageComponent[]} pages array of the pages objects
 * @property {int[]} visiblePages array of the visible pages by page number
 * @property {int} visiblePage currently visible page
 * @property {SelectionPopUpComponent} selectionPopUp popup related to selection functionality
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
    this.pages = [];
    this.visiblePages = [];
    this.visiblePage = null;
    this.selectionPopUp = new SelectionPopUpComponent();
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component and it's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.pdfContainer.addEventListener(
      "mousedown",
      textRenderService.hideLinks
    );
    this.components.pdfContainer.addEventListener(
      "mouseup",
      textRenderService.hideLinks
    );

    new ResizeObserver(() => {
      this.visiblePages.forEach((pageNum) => {
        this.pages[pageNum - 1].positionTextLayer();
      });
    }).observe(this.components.pdfContainer);

    EventHandlerService.subscribe(PDFLEvents.onRenderPage, (page) => {
      this.pages[page - 1].getCanvas().scrollIntoView();
      this.visiblePages = [page];
      this.#setVisiblePage(page);
    });

    EventHandlerService.subscribe(PDFLEvents.onZoomChange, (zoomScale) => {
      this.#setVisiblePageWithNewZoom(zoomScale);
    });

    EventHandlerService.subscribe(PDFLEvents.onResetReader, () => {
      this.reset();
    });

    EventHandlerService.subscribe(PDFLEvents.onReadNewFile, (pdf) => {
      this.components.pdfContainer.innerHTML = "";
      this.loadPdf(pdf);
    });
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

        this.#setupPages();
      })
      .catch((err) => {
        console.log(err.message); // TODO: handle error in some way
      });
    this.components.loader.classList.add("hidden");
  };

  /**
   * Sets current page of pagination component to 1 and current zoom level
   * of zoom component to 1. Clears pages array.
   */
  reset = () => {
    this.sidePageComponent.hideSidePage();
    this.toolbarComponent.reset();
    this.pages = [];
    this.visiblePage = null;
  };

  /**
   * Creates Pages objects, and appends their canvases to the
   * pdfContainer DOM element.
   */
  #createPages() {
    for (let i = 0; i < this.pdfDoc.numPages; ++i) {
      let page = new PdfPageComponent(i + 1, this.pdfDoc);
      let canvas = page.getCanvas();
      this.pages.push(page);

      this.components.pdfContainer.appendChild(canvas);
    }
  }

  /**
   * Creates pages object, sets their inital size and add the visibility
   * listener to them.
   *
   * Should only be called once after the pdf is loaded.
   *
   * @async
   */
  async #setupPages() {
    this.#createPages();

    await this.#setCanvasSize();

    this.#addVisibilityListenersToPages();
  }

  /**
   * Add visiblity listener to pages. Once a page enters or leaves the
   * viewport of the browser, an algorith is triggered to determine the
   * visible page.
   * Then the rendering is triggerd around that page.
   */
  #addVisibilityListenersToPages() {
    for (let i = 0; i < this.pdfDoc.numPages; ++i) {
      let page = this.pages[i];
      let canvas = page.getCanvas();

      respondToVisibility(canvas, (visible) => {
        if (visible) {
          this.visiblePages.push(i + 1);

          let visiblePageNum = Math.min(...this.visiblePages);
          this.#setVisiblePage(visiblePageNum);
        } else {
          let index = this.visiblePages.indexOf(i + 1);
          if (index != -1) {
            this.visiblePages.splice(index, 1);
          }
          this.visiblePageNum = Math.min(...this.visiblePages);
          this.toolbarComponent.setCurrentPage(this.visiblePageNum);
        }
      });
    }
  }

  /**
   * Set the canvas sizes for the pages.
   * Used at the beginning or when zoom changes to set the sizes of
   * unrendered pages so scroll position and size stays the same.
   *
   * @param {float} zoomScale
   */
  async #setCanvasSize(zoomScale = 1) {
    let [width, height] = await textRenderService.getPageSize(
      this.pdfDoc,
      zoomScale
    );
    this.pages.forEach((page) => page.setCanvasSize(width, height));
  }

  /**
   * Sets the visible page and if that page is different from the current page
   * render the pages around that page.
   *
   * If forceReRender is set, then ignore if the page is the same. (used when changing zoom)
   *
   * @param {int} pageNum
   * @param {bool} forceReRender
   */
  #setVisiblePage(pageNum, forceReRender = false) {
    if (pageNum == this.visiblePage && !forceReRender) {
      return;
    }
    this.visiblePage = pageNum;

    this.#renderPages(pageNum, forceReRender);

    this.toolbarComponent.setCurrentPage(pageNum);
  }

  /**
   * Changes canvas size of the pages and delegates work to
   * '#setVisiblePage'.
   *
   * @param {float} zoomScale
   * @async
   */
  async #setVisiblePageWithNewZoom(zoomScale) {
    this.#setCanvasSize(zoomScale);
    let visiblePageNum = Math.min(...this.visiblePages);
    setTimeout(() => {
      this.#setVisiblePage(visiblePageNum, true);
    }, 10);
  }

  /**
   * Renders the page numberered 'pageNum' and the pages before and after that page
   * set by the constant.
   *
   * If forceReRender is set, it will always render the page, even if it was already
   * rendered. (used when zoom changes)
   *
   * @param {int} pageNum
   * @param {bool} forceReRender
   */
  #renderPages = (pageNum, forceReRender) => {
    let zoom = this.toolbarComponent.getZoom();

    for (
      let i = pageNum - EXTRA_PAGES_TO_RENDER;
      i <= pageNum + EXTRA_PAGES_TO_RENDER;
      ++i
    ) {
      let page = this.pages[i];
      if (page) {
        page.render(zoom, forceReRender);
      }
    }
  };
}

export { PdfReaderComponent };
