import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { ToolbarComponent } from "./ToolbarComponents/ToolbarComponent";
import { ReferenceComponent } from "./ReferenceComponent";
import { PopupComponent } from "./PopupComponent";
import * as textRenderService from "../services/TextRenderService";
import { PdfPageComponent } from "./PdfPageComponent";
import { respondToVisibility } from "../services/Utils";
import { EXTRA_PAGES_TO_RENDER } from "../Constants";
import { SelectionPopUpComponent } from "./SelectionPopUpComponent";

import * as pdfjsLib from "pdfjs-dist/webpack";

/**
 * Component representing the PDF reader. Displays the content of PDF document and actions
 * that can be applied to the document in the reader.
 *
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.pdfContainer element containing the PDF reader
 * @property {ToolbarComponent} toolbarComponent toolbar component within the reader
 * @property {ReferenceComponent} referenceComponent component detecting and managing cross references
 * @property {PopupComponent} popupComponent popup component within the reader
 * @property {SelectionPopUpComponent} selectionPopUp popup related to selection functionality
 * @property {PDFDocumentProxy} pdfDoc PDF document
 * @property {PdfPageComponent[]} pages array of the pages objects
 * @property {int[]} visiblePages array of the visible pages by page number
 * @property {int} visiblePage currently visible page
 */
class PdfReaderComponent {
  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    loader: document.querySelector("#loader"),
  };

  /**
   * Creates and initializes new zoom component. Creates an instance of all components
   * within this component.
   *
   * @constructor
   */
  constructor() {
    this.toolbarComponent = new ToolbarComponent();
    this.referenceComponent = new ReferenceComponent();
    this.popupComponent = new PopupComponent();
    this.selectionPopUp = new SelectionPopUpComponent();

    this.pages = [];
    this.visiblePages = [];
    this.visiblePage = null;

    this.#registerEvents();
  }

  /**
   * Adds event listeners to component and it's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.pdfContainer.addEventListener(
      "mousemove",
      textRenderService.hideLinks
    );
    this.components.pdfContainer.addEventListener(
      "mousedown",
      textRenderService.hideLinks
    );

    new ResizeObserver(() => {
      this.#recalculateTextLayerPositionForVisiblePages();
    }).observe(this.components.pdfContainer);

    EventHandlerService.subscribe(PDFLEvents.onRenderPage, (page) => {
      if(this.pages[page - 1])
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
   * Loads the pdf document, configures 'child' components, delegates
   * page setup and rendering of the first page.
   * @param {Uint8Array} pdf data, filename or url of a PDF document
   */
  loadPdf = async (pdf) => {
    this.components.loader.classList.add("hidden");

    let data = await pdfjsLib.getDocument(pdf).promise;
    
    this.pdfDoc = data;
    this.toolbarComponent.setPageCount(data.numPages);
    EventHandlerService.publish(PDFLEvents.onReadNewPdf, data);

    await this.#setupPages();
    this.#renderPages(1);
  };

  /**
   * Sets current page of pagination component to 1 and current zoom level
   * of zoom component to 1. Clears pages array.
   */
  reset = () => {
    this.toolbarComponent.reset();
    this.pages = [];
    this.visiblePages = [];
    this.visiblePage = null;
    window.scrollTo(0, 0);
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
          this.#recalculateTextLayerPositionForVisiblePages();

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
   * Positions text layer for visible pages, used when the pdf container resizes
   * or when the visible pages change.
   */
  #recalculateTextLayerPositionForVisiblePages() {
    this.visiblePages.forEach((pageNum) => {
      if(this.pages[pageNum - 1])
        this.pages[pageNum - 1].positionTextLayer();
    });
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
