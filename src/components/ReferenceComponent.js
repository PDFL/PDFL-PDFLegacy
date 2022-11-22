import {EventHandlerService, PDFLEvents} from "../services/EventHandlerService";
import { mouseOverDelayEvent } from "../services/Utils";
import {ImageExtractorService} from "../services/DocumentParser/ImageExtractorService";
import { TextExtractorService } from "../services/DocumentParser/TextExtractorService";
import {ExternalCitationExtractorService} from "../services/DocumentParser/ExternalCitationExtractorService";
import {TableExtractorService} from "../services/DocumentParser/TableExtractorService";

class ReferenceComponent {

  constructor() {
    this.pdfDoc = null;
    EventHandlerService.subscribe(PDFLEvents.onLinkLayerRendered, this.#onLinkLayerRendered.bind(this));
  }

  setPdfDoc = (pdfDoc) => {
    this.pdfDoc = pdfDoc;
  }

  #onLinkLayerRendered = () => {
    if(this.pdfDoc === null){ throw new Error('PDFDocument object missed'); }
    const pageHref = document.getElementsByClassName('internalLink');
    for (var i = 0; i < pageHref.length; i++) {
      const aElem = pageHref.item(i);
      aElem.addEventListener('click', this.#onInternalReferenceClick.bind(this));
      mouseOverDelayEvent(aElem, 2000, this.#onInternalReferenceOver.bind(this)); //Delay the over listener
    }
  }

  #onInternalReferenceClick = (event) => {
    const self = this;
    event.preventDefault();
    const target = event.target.closest('a');
    if (!target) return;
    const reference = target.getAttribute('href').replace('#', '');
    self.#solveReference(reference).then(pageNumber => {
      EventHandlerService.publish(PDFLEvents.onNewPageRequest, pageNumber);
    });
  };

  #onInternalReferenceOver = (event) => {
    const self = this;
    event.preventDefault();
    const target = event.target.closest('a');
    if (!target) return;
    const reference = target.getAttribute('href').replace('#', '');
    self.#solveReference(reference).then(pageNumber => {
      self.#parseReference(reference, pageNumber);
    });
  };

  #solveReference = async (refId) => {
    const self = this;
    const destinationObject = await self.pdfDoc.getDestination(refId);
    const pageIndex = await self.pdfDoc.getPageIndex(destinationObject[0])
    return pageIndex + 1;
  }

  #parseReference = (reference, pageNumber) => {
    const self = this;
    const referenceType = reference.split('.')[0];
    var parseService = undefined;
    switch (referenceType) {
      case 'figure':
        parseService = new ImageExtractorService(self.pdfDoc, pageNumber, reference);
        break;
      case 'section':
      case 'subsection':
      case 'subsubsection':
        parseService = new TextExtractorService(self.pdfDoc, pageNumber, reference);
        break;
      case 'cite':
        parseService = new ExternalCitationExtractorService(self.pdfDoc, pageNumber, reference);
        break;
      case 'table':
        parseService = new TableExtractorService(self.pdfDoc, pageNumber, reference);
        break;
      default:
        throw new Error("Parser not implemented exception for type " + referenceType);
    }
    parseService.getContent().then(result => {
      EventHandlerService.publish(PDFLEvents.onPopupContentReady, result);
    });
  }

}

export {ReferenceComponent};