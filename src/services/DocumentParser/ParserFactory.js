import { ImageExtractorService } from "./ImageExtractorService";
import { TextExtractorService } from "./TextExtractorService";
import { GenericExtractorService } from "./GenericExtractorService";

/**
 * Factory method used to initialize the correct parser given the referenceType.
 * If the reference type is invalid or not implemented yet the default one (Generic) is returned
 * @param referenceType {string} the parsed reference type
 * @param parameters {Object} object containing constructor parameters
 * @returns {GenericExtractorService|TextExtractorService|ImageExtractorService}
 */
function ParserFactory(referenceType, parameters) {
  switch (referenceType) {
    case "figure":
      return new ImageExtractorService(
        parameters.pdfDoc,
        parameters.pageNumber,
        parameters.reference
      );
    case "section":
    case "subsection":
    case "subsubsection":
      return new TextExtractorService(
        parameters.pdfDoc,
        parameters.pageNumber,
        parameters.reference
      );
    /*case "cite":
          return new ExternalCitationExtractorService(
            parameters.pdfDoc,
          parameters.pageNumber,
          parameters.reference
          );
          break;
      case "table":
        /*return new TableExtractorService(
         parameters.pdfDoc,
          parameters.pageNumber,
          parameters.reference
        );
        break;*/
    default:
      return new GenericExtractorService(
        parameters.pdfDoc,
        parameters.pageNumber,
        parameters.reference
      );
  }
}

export { ParserFactory };
