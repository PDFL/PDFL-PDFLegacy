import { DocumentParser } from "./DocumentParser";

/**
 * @extends DocumentParser
 * The generic extractor service is a subclass of DocumentParser and it is responsible to give a response back when no other parser are able to.
 * In detail, it returns an answare saying the content is a page and that cannot be rendered on the PopUp
 */
class GenericExtractorService extends DocumentParser {

  /**
   * @override
   * @see{DocumentParser}
   * @returns {Promise<{popupDisplayable: boolean, type: string}>}
   */
  getContent = async () => {
    return {
      type: "page",
      popupDisplayable: false,
    };
  };
}

export { GenericExtractorService };
