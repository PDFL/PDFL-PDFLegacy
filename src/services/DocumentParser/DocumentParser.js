/**
 * @abstract
 * @property {Object} pdfDocument
 * @property {int} targetPage
 * @property {string} targetElement
 */
class DocumentParser {

  constructor(pdfDocument, targetPage, targetElement) {
    if (this.constructor === DocumentParser) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.pdfDocument = pdfDocument;
    this.targetPage = targetPage;
    this.targetElement = targetElement;
  }

  /**
   * @returns {Promise<any>}
   */
  getContent = async () => {
    throw new Error('Method not implemented');
  };

}
export {DocumentParser}