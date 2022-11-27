import { DocumentParser } from "./DocumentParser";

class TextExtractorService extends DocumentParser {
  getContent = async () => {
    //throw new Error("Not implemented yet");
    console.log(this.#parseReference());
    this.pdfDocument.getPage(this.targetPage).then((p) => {
      p.getTextContent().then((t) => {
        console.log(t);
      });
    });
  };

  /**
   * Return the section number of the given references (for example if ref is section.1.5.3 return 1.5.3)
   * @returns {string}
   */
  #parseReference = () => {
    var ref = [];
    const splitted = this.targetElement.split(".");
    splitted.forEach((strComponent) => {
      if (!isNaN(strComponent) && !isNaN(parseInt(strComponent))) {
        ref.push(strComponent);
      }
    });
    return ref.join(".");
  };
}

export { TextExtractorService };
