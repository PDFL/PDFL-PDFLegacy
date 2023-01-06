import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { THUMBNAIL_PAGE_VIEWPORT_SCALE } from "../Constants";

/**
 * Component responsible for creating and displaying PDF thumbnail.
 * The thumbnail contains all PDF pages which can be scrolled through and
 * clicked.
 * 
 * @property {Object} components object that holds all DOM elements within this component
 * @property {HTMLElement} components.toolbar element that represents this component
 * @property {Object} pdfjsLib PDF.js library
 * @property {boolean} isOpened state of component which can be either closed or opened
 */
class ThumbnailComponent {
  components = {
    thumbnail: document.querySelector("#thumbnail"),
  };

  /**
   * Creates and initializes new thumbnail component. Sets component state to closed.
   */
  constructor() {
    this.pdfjsLib = require("pdfjs-dist");
    this.isOpened = false;

    this.#registerEvents();
  }

  /**
   * Registers event listeners to this component.
   * @private
   */
  #registerEvents = () => {
    EventHandlerService.subscribe(PDFLEvents.onReadNewFile, (pdfDoc) =>
      this.#createNewThumbnail(pdfDoc)
    );

    EventHandlerService.subscribe(PDFLEvents.onToggleThumbnail, (pageNumber) =>
      this.#toggle(pageNumber)
    );

    EventHandlerService.subscribe(PDFLEvents.onPageChanged, (pageNumber) =>
      this.#setSelectedPage(document.querySelectorAll(".thumbnail-page-canvas")[pageNumber - 1])
    );
  };

  /**
   * Closes the thumbnail if it was opened and vice versa. Changes
   * state accordingly and sets selected page in thumbnail.
   * @private
   */
  #toggle = (pageNumber) => {
    this.isOpened ? this.#close() : this.#open();

    this.isOpened = !this.isOpened;
    this.#setSelectedPage(document.querySelectorAll(".thumbnail-page-canvas")[pageNumber - 1]);
  };

  /**
   * Displays thumbnail.
   */
  #open = () => {
    this.components.thumbnail.classList.remove("hidden");
  };

  /**
   * Hides thumbnail.
   */
  #close = () => {
    this.components.thumbnail.classList.add("hidden");
  };

  /**
   * Removes old and creates new thumbnail from PDF document data.
   * @param {Uint8Array} pdfDoc PDF document data
   */
  #createNewThumbnail = async (pdfDoc) => {
    this.#clear();

    let document = await this.pdfjsLib.getDocument(pdfDoc).promise;
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++)
      await this.#createPage(await document.getPage(pageNumber), pageNumber);
  };

  /**
   * Removes all page elements from thumbnail element.
   */
  #clear = () => {
    this.components.thumbnail.innerHTML = "";
  };

  /**
   * Creates new small PDF page in thumbnail. 
   * @param {PDFPageProxy} page PDF page
   * @param {int} num page number
   */
  #createPage = async (page, num) => {
    let viewport = this.#createPageViewport(page);
    let canvas = this.#createPageCanvas(viewport, num);

    await page.render({ canvasContext: canvas.getContext("2d"), viewport: viewport }).promise;
    this.#createPageContainer(canvas, num);
  };

  /**
   * Returns page viewport scaled to 0.2.
   * @param {PDFPageProxy} page PDF page
   * @returns {Object} viewport
   */
  #createPageViewport = (page) => {
    return page.getViewport({
      scale: THUMBNAIL_PAGE_VIEWPORT_SCALE,
    });
  };

  /**
   * Creates styled page canvas with click event.
   * 
   * @param {Object} viewport page viewport
   * @param {int} pageNumber page number
   * @returns {HTMLElement} canvas
   */
  #createPageCanvas = (viewport, pageNumber) => {
    let canvas = document.createElement("canvas");

    this.#setCanvasStyle(canvas, pageNumber == 1);
    canvas.classList.add("thumbnail-page-canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.addEventListener("click", () =>
      this.#pageClicked(canvas, pageNumber)
    );

    return canvas;
  };

  /**
   * Adds canvas style depending if page is
   * selected or not.
   * 
   * @param {HTMLElement} canvas page canvas
   * @param {boolean} isSelected is page selected
   */
  #setCanvasStyle(canvas, isSelected) {
    if (isSelected) this.#setSelectedCanvasStyle(canvas);
    else this.#setDefaultCanvasStyle(canvas);
  }

  /**
   * Sets style of selected page canvas. Selected page
   * canvas has a blue border and 100% opacity.
   * @param {HTMLElement} canvas page canvas
   */
  #setSelectedCanvasStyle(canvas) {
    canvas.classList.remove("half-opacity");
    canvas.classList.add("full-opacity", "blue-border");
  }

  /**
   * Sets default style of page canvas. Default style
   * of page has 50% opacity.
   * @param {HTMLElement} canvas page canvas
   */
  #setDefaultCanvasStyle(canvas) {
    canvas.classList.remove("full-opacity", "blue-border");
    canvas.classList.add("half-opacity");
  }

  /**
   * Callback for when page canvas  in thumbnail is clicked. Publishes
   * an event to change page in reader and sets selected page.
   * @param {HTMLElement} canvas page canvas
   * @param {int} pageNumber page number
   */
  #pageClicked = (canvas, pageNumber) => {
    EventHandlerService.publish(PDFLEvents.onNewPageRequest, pageNumber);

    this.#setSelectedPage(canvas);
  };

  /**
   * Sets selected page in thumbnail.
   * @param {HTMLElement} canvas page canvas
   */
  #setSelectedPage = (canvas) => {
    if(!canvas) return;
    this.#unselectAllCanvases();
    this.#setSelectedCanvasStyle(canvas);
    this.#setScrollPosition(canvas);
  };

  /**
   * Sets default style to all page canvases in thumbnail.
   */
  #unselectAllCanvases() {
    document.querySelectorAll(".thumbnail-page-canvas").forEach((canvas) => {
      this.#setDefaultCanvasStyle(canvas);
    });
  }

  /**
   * Sets scroll position to display given canvas. If canvas is already
   * visible scroll does not change and if it is not visible scroll position
   * is changed so it is visible in the bottom of thumbnail.
   * @param {HTMLElement} canvas page canvas
   */
  #setScrollPosition = (canvas) => {
    canvas.parentElement.scrollIntoView({ block: "nearest" });
    canvas.parentElement.focus({ preventScroll: true });
  };

  /**
   * Creates page container which contains page canvas
   * and page number below it.
   * @param {HTMLElement} canvas page canvas
   * @param {int} num page number
   * @returns {HTMLElement} page container
   */
  #createPageContainer = (canvas, num) => {
    let container = document.createElement("div");

    container.classList.add("thumbnail-page");
    container.appendChild(canvas);
    container.appendChild(this.#createPageNumberContainer(num));

    this.components.thumbnail.appendChild(container);

    return container;
  };

  /**
   * Creates container which only contains page number.
   * @param {int} num page number
   * @returns {HTMLElement} page number container
   */
  #createPageNumberContainer = (num) => {
    let numberDiv = document.createElement("div");

    numberDiv.classList.add("thumbnail-page-num");
    numberDiv.innerText = num;

    return numberDiv;
  };
}

export { ThumbnailComponent };
