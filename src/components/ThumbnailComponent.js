import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

class ThumbnailComponent {
  components = {
    thumbnail: document.querySelector("#thumbnail"),
  };

  constructor() {
    this.isOpened = false;

    this.#registerEvents();
  }

  #registerEvents = () => {
    EventHandlerService.subscribe(PDFLEvents.onCreateThumbnail, (pdfDoc) =>
      this.#createNewThumbnail(pdfDoc)
    );

    EventHandlerService.subscribe(PDFLEvents.onToggleThumbnail, () =>
      this.#toggle()
    );
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

    for (let pageNumber = 1; pageNumber <= pdfDoc.numPages; pageNumber++)
      this.#createPage(await pdfDoc.getPage(pageNumber), pageNumber);
  };

  #clear = () => {
    this.components.thumbnail.innerHTML = "";
  };

  #createPage = (page, num) => {
    let viewport = this.#createPageViewport(page);
    let canvas = this.#createPageCanvas(viewport, num);

    page
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

    if (pageNumber == 1)
      canvas.classList.add("thumbnail-page-canvas", "full-opacity", "blue-border");
    else 
        canvas.classList.add("thumbnail-page-canvas", "half-opacity");

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.onclick = () => this.#pageClicked(canvas, pageNumber);

    return canvas;
  };

  #pageClicked = (canvas, pageNumber) => {
    EventHandlerService.publish(PDFLEvents.onNewPageRequest, pageNumber);

    document.querySelectorAll(".thumbnail-page-canvas").forEach((c) => {
      c.classList.remove("full-opacity", "blue-border");
      c.classList.add("half-opacity");
    });
    canvas.classList.remove("half-opacity");
    canvas.classList.add("full-opacity", "blue-border");
  };

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
