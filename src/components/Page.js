import { renderText, positionTextLayer } from "../services/TextRenderService";

/**
 * Represents a pdf page, holds the canvas where the page will be rendered.
 * Encapsulates rendering of the page and the text layer.
 *
 * @property {int} renderTask
 * @property {PDFDoc} pdfDoc object from pdf.js library
 * @property {bool} isRendering true if the render task is active
 * @property {bool} isRendered true if the page is rendered
 * @property {ResizeObserver} resizeObserver observer for resizing this HTMLElement
 * @property {HTMLElement} canvas inner canvas for this page
 * @property {RenderTask} renderTask rendering task of the pdf.js library for a page
 */
class Page {
  /**
   * Creates the page object.
   * Does not set the size of the canvas (page) or starts rendering the page.
   *
   * To render the page a client must instantiate this object and call the 'render' method.
   *
   * If the client does not wish to render the page yet but wants the page to take up some space
   * 'setCanvasSize' should be called.
   *
   * If the client renders the page, 'setCanvasSize' does not need to be called before of after rendering.
   *
   * @param {int} pageNum number for the page
   * @param {PDFDoc} pdfDoc pdfDoc object from pdf.js library
   */
  constructor(pageNum, pdfDoc) {
    this.pageNum = pageNum;
    this.pdfDoc = pdfDoc;
    this.isRendering = false;
    this.isRendered = false;
    this.resizeObserver = null;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", `canvas-${pageNum}`);
    this.canvas.setAttribute("class", "canvas__container");
  }

  /**
   * Renders the page and text layer for the page.
   * If the page is already rendered it will not render it again.
   * If the page is currently rendering it will stop the current render task
   * and begin a new one.
   *
   * @param {float} zoomScale set the zoom for page rendering
   * @param {bool} force if true, render the page no matter what
   * @async
   */
  render = async (zoomScale, force = false) => {
    if (this.isRendered && !force) {
      return;
    }
    await this.#stopRendering();

    let page = await this.pdfDoc.getPage(this.pageNum);

    const ctx = this.canvas.getContext("2d");
    let viewport = page.getViewport({
      scale: zoomScale,
    });
    this.canvas.height = viewport.height;
    this.canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport: viewport,
    };

    this.isRendering = true;
    this.isRendered = false;
    this.renderTask = page.render(renderCtx);

    const self = this;
    this.renderTask.promise
      .then(function () {
        self.isRendering = false;
        self.isRendered = true;

        renderText(page, self.pageNum, self.canvas, viewport);
      })
      .catch(() => {
        // do nothing, the rendering task was canceled
      });
  };

  /**
   * Getter for the inner canvas of this page.
   *
   * @returns {HTMLElement} canvas
   */
  getCanvas = () => {
    return this.canvas;
  };

  /**
   * Sets the size of the canvas.
   *
   * @param {int} width
   * @param {int} height
   */
  setCanvasSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.isRendered = false;
  }

  /**
   * Updates the position of the text layer.
   * Should be called when the pdf container changes size.
   */
  positionTextLayer() {
    let textLayer = document.querySelector(`#text-layer-${this.pageNum}`);
    positionTextLayer(textLayer, this.canvas);
  }

  /**
   * Stops rendering the page if the rendering task is in progress.
   *
   * @async
   */
  #stopRendering = async () => {
    if (this.isRendering) {
      await this.renderTask.cancel();
    }
    this.isRendering = false;
  };
}

export { Page };
