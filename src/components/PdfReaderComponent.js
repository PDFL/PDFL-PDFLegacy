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
import { SummaryKeyComponent } from "./SummaryKeyComponent";
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
 * @property {SelectionPopUpComponent} selectionPopUp popup related to selection functionality
 */
class PdfReaderComponent {
  components = {
    pdfContainer: document.querySelector("#pdf-container"),
    openNew: document.querySelector("#open-new"),
    canvas: null,
    viewport: null,
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
    this.selectionPopUp = new SelectionPopUpComponent();
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component and it's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.openNew.addEventListener("click", this.#onNewFile);

    this.components.pdfContainer.addEventListener(
      "mousemove",
      textRenderService.hideLinks
    );

    new ResizeObserver(() => {
      textRenderService.positionTextLayer(
        this.components.canvas,
        this.components.viewport
      );
    }).observe(this.components.pdfContainer);

    EventHandlerService.subscribe(PDFLEvents.onRenderPage, () => {
      textRenderService.renderPage(
        this.pdfDoc,
        this.components,
        this.toolbarComponent
      );
    });

    EventHandlerService.subscribe(PDFLEvents.onResetReader, () => {
      this.reset();
    });

    EventHandlerService.subscribe(PDFLEvents.onReadNewFile, (pdf) => {
      this.loadPdf(pdf);
    });

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      (functionalKeys, key) => {
        if (!functionalKeys.ctrl) {
          return;
        }
        if (key === "u") {
          this.#onNewFile();
        }
      }
    );
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

        textRenderService.renderPage(
          self.pdfDoc,
          self.components,
          self.toolbarComponent
        );
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
}

export { PdfReaderComponent };
