import {DocumentParser} from "./DocumentParser";

class TextExtractorService extends DocumentParser {

  getContent = async () => {
    return this.pdfDocument.getPage(this.targetPage);
  }

}

export {TextExtractorService}