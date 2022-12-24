import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

const pdfjsLib = require("pdfjs-dist");

class ThumbnailComponent {
  components = {
    thumbnail: document.querySelector("#thumbnail"),
  };

  constructor() {
    this.isOpened = false;

    this.#registerEvents();
  }

  #registerEvents = () => {
    EventHandlerService.subscribe(PDFLEvents.onReadNewFile, (pdfDoc) =>
      this.#createNewThumbnail(pdfDoc)
    );

    EventHandlerService.subscribe(PDFLEvents.onToggleThumbnail, () =>
      this.#toggle()
    );

    EventHandlerService.subscribe(PDFLEvents.onPageChanged, (pageNumber) => 
      this.#setSelectedPage(document.querySelectorAll(".thumbnail-page-canvas")[pageNumber - 1])
    )
  };

  #toggle = () => {
    this.isOpened ? this.#close() : this.#open();

    this.isOpened = !this.isOpened;
  };

  #open = () => {
    this.components.thumbnail.classList.remove("hidden");
  };

  #close = () => {
    this.components.thumbnail.classList.add("hidden");
  };

  #createNewThumbnail = async (pdfDoc) => {
    this.#clear();

    let document = await pdfjsLib.getDocument(pdfDoc).promise;
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++)
      await this.#createPage(await document.getPage(pageNumber), pageNumber);
  };

  #clear = () => {
    this.components.thumbnail.innerHTML = "";
  };

  #createPage = async (page, num) => {
    let viewport = this.#createPageViewport(page);
    let canvas = this.#createPageCanvas(viewport, num);

    await page
      .render({ canvasContext: canvas.getContext("2d"), viewport: viewport })
      .promise.then(() => this.#createPageContainer(canvas, num));
  };

  #createPageViewport = (page) => {
    return page.getViewport({
      scale: 0.2,
    });
  };

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

  #setCanvasStyle(canvas, isSelected) {
    if (isSelected)
      this.#setSelectedCanvasStyle(canvas);
    else
      this.#setDefaultCanvasStyle(canvas);
  }

  #setSelectedCanvasStyle(canvas) {
    canvas.classList.remove("half-opacity");
    canvas.classList.add("full-opacity", "blue-border");
  }
  
  #setDefaultCanvasStyle(canvas) {
    canvas.classList.remove("full-opacity", "blue-border");
    canvas.classList.add("half-opacity");
  }

  #pageClicked = (canvas, pageNumber) => {
    EventHandlerService.publish(PDFLEvents.onNewPageRequest, pageNumber);
    
    this.#setSelectedPage(canvas);
  };

  #setSelectedPage = (canvas) => {
    this.#unselectAllCanvases();
    this.#setSelectedCanvasStyle(canvas);
  }

  #unselectAllCanvases() {
    document.querySelectorAll(".thumbnail-page-canvas").forEach((canvas) => {
      this.#setDefaultCanvasStyle(canvas);
    });
  }

  #createPageContainer = (canvas, num) => {
    let container = document.createElement("div");

    container.classList.add("thumbnail-page");
    container.appendChild(canvas);
    container.appendChild(this.#createPageNumberContainer(num));

    this.components.thumbnail.appendChild(container);

    return container;
  };

  #createPageNumberContainer = (num) => {
    let numberDiv = document.createElement("div");

    numberDiv.classList.add("thumbnail-page-num");
    numberDiv.innerText = num;

    return numberDiv;
  };
}

export { ThumbnailComponent };
