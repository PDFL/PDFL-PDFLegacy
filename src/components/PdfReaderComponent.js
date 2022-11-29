import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { SidePageComponent } from "./SidePageComponent";
import { ToolbarComponent } from "./ToolbarComponent";
import { ReferenceComponent } from "./ReferenceComponent";

const pdfjsLib = require("pdfjs-dist");
const pdfjsViewer = require("pdfjs-dist/web/pdf_viewer");

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
 * @property {RenderTextComponent} renderTextComponent functions to render links and so on
 */
class PdfReaderComponent {

  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    openNew: document.querySelector("#open-new"),
    canvas: null,
    viewport: null,
  };

  /**
   * Creates and initializes new zoom component. Creates new ToolbarComponent and 
   * SidePageComponent objects.
   * @constructor
   */
  constructor() {
    this.toolbarComponent = new ToolbarComponent();
    this.sidePageComponent = new SidePageComponent();
    this.referenceComponent = new ReferenceComponent();
    this.#registerEvents();
  }


  /**
   * Adds event listeners to component and it's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.openNew.addEventListener('click', this.#onNewFile);

    this.components.pdfContainer.addEventListener('mousemove', this.#hideLinks);

    EventHandlerService.subscribe(PDFLEvents.onRenderPage, () => {
      this.#renderPage();
      this.#renderText();
    });

    EventHandlerService.subscribe(PDFLEvents.onResetReader, () => {
      this.reset();
    });

    EventHandlerService.subscribe(PDFLEvents.onReadNewFile, (pdf) => {
      this.loadPdf(pdf);
    });
  }

  /**
   * Cretes event triggered when application view changed from reader view to input view.
   * @private
   */
  #onNewFile = () => {
    EventHandlerService.publish(PDFLEvents.onShowInputView);
  };

  #hideLinks = () => {
    var textSel = window.getSelection();
    var links = document.getElementsByClassName('linkAnnotation');

    if (textSel == 0) {
      for (let i = 0; i <= links.length - 1; i++) {
        links[i].style.display = "block";

      }
    } else {
      for (let i = 0; i <= links.length - 1; i++) {
        links[i].style.display = "none";
      }
    }
  }

  /**
   * Load and render the first page of the given pdf.
   * @param {Uint8Array} pdf data, filename or url of a PDF document
   */
  loadPdf = (pdf) => {
    const self = this;
    const loader = document.querySelector("#loader");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "webpack/pdf.worker.bundle.js";
    pdfjsLib.getDocument(pdf).promise.then((data) => {
      self.pdfDoc = data;
      self.referenceComponent.setPdfDoc(data);
      self.toolbarComponent.setPageCount(data.numPages);
      self.sidePageComponent.setPDF(data);
      self.#renderPage();
      self.#renderText();
      //self.#renderLink();
    })
      .catch((err) => {
        console.log(err.message); // TODO: handle error in some way
      });
    loader.className += " hidden";
  };

  /**
   * Renders the page.
   * @private
   */
  #renderPage = () => {
    const component = this.components;
    this.pdfDoc
      .getPage(this.toolbarComponent.getCurrentPage())
      .then((page) => {

        //Set the HTML properties
        component.canvas = document.createElement("canvas");
        component.canvas.setAttribute("class", "canvas__container");

        const ctx = component.canvas.getContext("2d");
        component.viewport = page.getViewport({
          scale: this.toolbarComponent.getZoom(),
        });
        component.canvas.height = component.viewport.height;
        component.canvas.width = component.viewport.width;

        // Render the PDF page into the canvas context.
        const renderCtx = {
          canvasContext: ctx,
          viewport: component.viewport,
        };

        page.render(renderCtx);

        //Scroll is possible but not supported by other navigation functions, clear container before adding the new page
        component.pdfContainer.innerHTML = "";
        component.pdfContainer.appendChild(component.canvas);
        this.toolbarComponent.setCurrentPage();
      });
  };

  /**
     * Private function to render the text 
     */
  #renderText = () => {
    const component = this.components;
    const self = this;
    this.pdfDoc
      .getPage(this.toolbarComponent.getCurrentPage())
      .then((page) => {

        //Set the HTML properties
        const textLayer = document.createElement("div");
        textLayer.setAttribute('class', 'textLayer');

        page.getTextContent().then(function (textContent) {

          textLayer.style.left = component.canvas.offsetLeft + 'px';
          textLayer.style.top = component.canvas.offsetTop + 'px';
          textLayer.style.height = component.canvas.offsetHeight + 'px';
          textLayer.style.width = component.canvas.offsetWidth + 'px';

          //Render the text inside the textLayer container
          pdfjsLib.renderTextLayer({
            textContent: textContent,
            container: textLayer,
            viewport: component.viewport,
            textDivs: []
          });

        });

        const pdfLinkService = new pdfjsViewer.PDFLinkService();

        page.getAnnotations().then(function (annotationsData) {

          textLayer.style.left = component.canvas.offsetLeft + 'px';
          textLayer.style.top = component.canvas.offsetTop + 'px';
          textLayer.style.height = component.viewport.offsetHeight + 'px';
          textLayer.style.width = component.viewport.offsetWidth + 'px';


          //Render the text inside the textLayer container
          pdfjsLib.AnnotationLayer.render({
            div: textLayer,
            viewport: component.viewport.clone({ dontFlip: true }),
            annotations: annotationsData,
            page: page,
            linkService: pdfLinkService,
            enableScripting: true,
            renderInteractiveForms: true,
          });

          //for @matteovisotto: --onLinkLayerRendered--
          EventHandlerService.publish(PDFLEvents.onLinkLayerRendered);
        });

        //Display the container
        component.pdfContainer.appendChild(textLayer);
      });

  }

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
