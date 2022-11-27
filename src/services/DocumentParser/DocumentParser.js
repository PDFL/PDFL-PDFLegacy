/**
 * @abstract
 * The document parser class defines the structure of a parser class, it is abstract and it is not allowed to use it directly
 * @property {Object} pdfDocument
 * @property {int} targetPage
 * @property {string} targetElement
 */
class DocumentParser {
  /**
   * This constructor defines the elements needed from the parser but it cannot be instanced directly, only from subclasses
   * @param pdfDocument the pdf document for which the parsing action has to be executed
   * @param targetPage the number of the page to be parsed
   * @param targetElement the reference
   */
  constructor(pdfDocument, targetPage, targetElement) {
    if (this.constructor === DocumentParser) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.pdfDocument = pdfDocument;
    this.targetPage = targetPage;
    this.targetElement = targetElement;
  }

  /**
   * Method to be overridden, it is called by the reference component and return the promise with the result of the specific parsing.
   * @returns {Promise<any>}
   */
  getContent = async () => {
    throw new Error("Method not implemented");
  };
}
export { DocumentParser };
