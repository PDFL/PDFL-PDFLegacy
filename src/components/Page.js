import { renderText2 } from "../services/TextRenderService";

/**
 * @property {RenderTask} renderTask
 */
class Page {
  constructor(pageNum, pdfDoc) {
    this.pageNum = pageNum;
    this.pdfDoc = pdfDoc;
    this.isRendering = false;
    this.isRendered = false;
    this.resizeObserver = null;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", `canvas-${pageNum}`);
    this.canvas.setAttribute("class", "canvas__container");

    this.#registerEvents();
  }

  #registerEvents = () => {
    // TODO cleanup
    this.resizeObserver = new ResizeObserver(() => {
      if (this.isRendered) {
        console.log("re render text layer");
      }
    }).observe(this.canvas);
  };

  render = async (zoomScale, force = false) => {
    if (this.isRendered && !force) {
      console.log("ALREADY RENDERED");
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

        console.log("CP");

        //TODO render text
        renderText2(self.pdfDoc, page, self.pageNum, self.canvas, viewport);
      })
      .catch((e) => {
        // do nothing, the rendering task was canceled
        console.log(e);
      });
  };

  getCanvas = () => {
    return this.canvas;
  };

  #stopRendering = async () => {
    if (this.isRendering) {
      await this.renderTask.cancel();
    }
    this.isRendering = false;
  };

  setCanvasSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.isRendered = false;
  }
}

export { Page };
