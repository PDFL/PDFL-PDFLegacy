import {DocumentParser} from "./DocumentParser";

class GenericExtractorService extends DocumentParser {
  //TODO:- Given the reference as [{num: , gen:},{name: }, X, Y, Z] is it possible to know which is the element using operation list?
  getContent = async () => {
    //return this.#getDestinationElement();
    throw new Error('Not implemented yet');
  }

  #getDestinationElement = async () => {

  }

  #getTargetPage = async () => {
    const page = await this.pdfDocument.getPage(this.targetPage);

  }

}

export {GenericExtractorService}