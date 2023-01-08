import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { mouseOverDelayEvent } from "../services/Utils";
import { ParserFactory } from "../services/DocumentParser/ParserFactory";

import { POPUP_APPEAR_TIMEOUT } from "../Constants";

/**
 * This class handles user interaction with internal document references
 * @property {PDFDocumentProxy} pdfDoc
 * @property {Object} overEventPosition
 */
class ReferenceComponent {
  /**
   * @constructor
   * Create a class object and call register events function
   * Create and set the empty position object
   */
  constructor() {
    this.overEventPosition = { x: null, y: null };
    this.#registerEvents();
  }

  /**
   * @private
   * Register events, in particular it subscribes to the event notifying the completion of the PDF render
   */
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
   * Set the pdf document
   * @param pdfDoc
   */
  #setPDF = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
  };

  /**
   * Get the <a> tags from the DOM of a textLayer and add the event listener
   * both for click and onMouseOver with delay.
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
   * @private
   * @async
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
    const pageNumber = await this.#solveReference(reference);
    EventHandlerService.publish(PDFLEvents.onNewPageRequest, pageNumber);
  };

  /**
   * @private
   * @async
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
    await this.#parseReference(reference, pageNumber);
  };

  /**
   * @private
   * @async
   * Given an id the function it returns a promise with the correct page number of the reference
   * @param {string} refId the reference ID from the dom
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
   * @private
   * @async
   * Call the correct parser and rise ad event to notify that popup content is ready
   * @param {string} reference the reference from the dom
   * @param {number} pageNumber the solved page number
   * @return Promise<Void>
   */
  #parseReference = async (reference, pageNumber) => {
    const referenceType = reference.split(".")[0];
    const parseService = ParserFactory(referenceType, {
      pdfDoc: this.pdfDoc,
      pageNumber: pageNumber,
      reference: reference,
    });

    try {
      const result = await parseService.getContent();
      EventHandlerService.publish(
        PDFLEvents.onPopupContentReady,
        this.overEventPosition,
        pageNumber,
        result
      );
    } catch (exception) {
      EventHandlerService.publish(
        PDFLEvents.onPopupContentReady,
        this.overEventPosition,
        pageNumber,
        { type: "page", popupDisplayable: false }
      );
    }
  };
}

export { ReferenceComponent };
