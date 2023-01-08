import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { mouseOverDelayEvent } from "../services/Utils";
import { ParserFactory } from "../services/DocumentParser/ParserFactory";

import { POPUP_APPEAR_TIMEOUT } from "../Constants";

/**
 * This class handles user interaction with internal document references.
 * @property {object} pdfDoc
 * @property {object} overEventPosition
 */
class ReferenceComponent {
  /**
   * @constructor
   * Create a class object and call register events function
   */
  constructor() {
    this.overEventPosition = { x: null, y: null };
    this.#registerEvents();
  }

  #registerEvents = () => {
    EventHandlerService.subscribe(
      PDFLEvents.onLinkLayerRendered,
      this.#onLinkLayerRendered.bind(this)
    );

    EventHandlerService.subscribe(PDFLEvents.onReadNewPdf, (pdf) => {
      this.#setPDF(pdf);
    });
  };

  /**
   * Sets the PDF document.
   * @private
   * @param {PDFDocumentProxy} pdfDocument PDF document
   */
  #setPDF = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
  };

  /**
   * Get the a tags from the DOM of a textLayer and add the event listener
   * both for click and onMouseOver with delay.
   *
   * @param {HTMLElement} textLayer rendered text layer with 'internalLinks' (a tags)
   * @private
   */
  #onLinkLayerRendered = (textLayer) => {
    if (!this.pdfDoc) {
      throw new Error("PDFDocument object missed");
    }
    const pageHref = textLayer.getElementsByClassName("internalLink");
    for (var i = 0; i < pageHref.length; i++) {
      const aTagElement = pageHref.item(i);
      aTagElement.addEventListener(
        "click",
        this.#onInternalReferenceClick.bind(this)
      );

      mouseOverDelayEvent(
        aTagElement,
        POPUP_APPEAR_TIMEOUT,
        this.#onInternalReferenceOver.bind(this)
      );
    }
  };

  /**
   * Function for handling the onClick event of a reference
   * Solve the reference and publish and event to require the page change
   * @param event
   */
  #onInternalReferenceClick = async (event) => {
    event.preventDefault();
    const target = event.target.closest("a");
    if (!target) return;
    const reference = decodeURIComponent(
      target.getAttribute("href").replace("#", "")
    );
    console.log(reference);
    const pageNumber = await this.#solveReference(reference);
    EventHandlerService.publish(PDFLEvents.onNewPageRequest, pageNumber);
  };

  /**
   * Function for handling the onMouseOver event of a reference
   * @param event
   */
  #onInternalReferenceOver = async (event) => {
    event.preventDefault();
    this.overEventPosition.x = event.clientX;
    this.overEventPosition.y = event.clientY;
    const target = event.target.closest("a");
    if (!target) return;
    const reference = decodeURIComponent(
      target.getAttribute("href").replace("#", "")
    );
    const pageNumber = await this.#solveReference(reference);
    this.#parseReference(reference, pageNumber);
  };

  /**
   * Given ad id the function return a promise with the correct page number of the reference
   * @param refId the reference ID from the dom
   * @returns {Promise<number>}
   */
  #solveReference = async (refId) => {
    var destinationObject;
    if (refId.includes("num") && refId.includes("gen")) {
      try {
        destinationObject = JSON.parse(refId);
      } catch (e) {
        destinationObject = null;
      }
    } else {
      destinationObject = await this.pdfDoc.getDestination(refId);
    }

    if (destinationObject == null) {
      throw new Error("Unsupported reference type");
    }

    const pageIndex = await this.pdfDoc.getPageIndex(destinationObject[0]);
    return pageIndex + 1;
  };

  /**
   * Call the correct parser and rise ad event to notify that popup content is ready
   * @async
   * @param reference the reference from the dom
   * @param pageNumber the solved page number
   */
  #parseReference = async (reference, pageNumber) => {
    const self = this;
    const referenceType = reference.split(".")[0];
    const parseService = ParserFactory(referenceType, {
      pdfDoc: self.pdfDoc,
      pageNumber: pageNumber,
      reference: reference,
    });

    try {
      let result = await parseService.getContent();
      EventHandlerService.publish(
        PDFLEvents.onPopupContentReady,
        self.overEventPosition,
        pageNumber,
        result
      );
    } catch (err) {
      EventHandlerService.publish(
        PDFLEvents.onPopupContentReady,
        self.overEventPosition,
        pageNumber,
        { type: "page", popupDisplayable: false }
      );
    }
  };
}

export { ReferenceComponent };
