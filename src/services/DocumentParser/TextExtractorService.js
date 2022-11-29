import { DocumentParser } from "./DocumentParser";
import { MAX_POPUP_TEXT_LENGTH } from "../../Constants";

/**
 * @extends DocumentParser
 * The Text extractor service is a subclass of DocumentParser and it is responsible to give a response back when a text content has to be parsed
 * In detail, it returns an answare saying the content is a text with a title and can be displayed into a popup
 */
class TextExtractorService extends DocumentParser {
  /**
   * @override
   * @see{DocumentParser}
   * @returns {Promise<{popupDisplayable: boolean, text: (string|*), type: string, title: string}>}
   */
  getContent = async () => {
    const self = this;
    const page = await this.pdfDocument.getPage(this.targetPage);
    const reference = self.#parseReference();
    const text = await self.#getText(page, reference);
    return {
      type: "text",
      popupDisplayable: true,
      title: text.title,
      text: this.#cutText(text.text),
    };
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

  /**
   * @async
   * This function align the start index to the reference starting point and then return the text of the rest on the page with the reference title
   * @param page pdf page object
   * @param reference parsed reference string
   * @returns {Promise<{text: string, title: string}>}
   */
  #getText = async (page, reference) => {
    var title = "";
    let text = await page.getTextContent();
    var refFound = false;
    var index = 0;
    while (!refFound || index < text.items.length) {
      if (text.items[index].str === reference) {
        title =
          String(text.items[index].str) +
          String(text.items[index + 1].str) +
          String(text.items[index + 2].str);
        text = this.#clearText(text, index);
        refFound = true;
      } else {
        text.items.splice(index, 1);
        index = index + 1;
      }
    }
    return {
      title: title,
      text: text.items
        .map(function (s) {
          return s.str;
        })
        .join(" ")
        .trim(),
    };
  };

  /**
   * This function cuts a given string using the length defined in the constant MAX_POPUP_TEXT_LENGTH
   * If the input string is shorter return the whole string.
   * @param text A string
   * @param ending The ending more character (by defaults ...)
   * @returns {string|*}
   */
  #cutText = (text, ending = "...") => {
    if (text.length > MAX_POPUP_TEXT_LENGTH) {
      return text.substring(0, MAX_POPUP_TEXT_LENGTH - ending.length) + ending;
    } else {
      return text;
    }
  };

  /**
   * This function remove the reference component from the array to start the string with the paragraph instead of the title
   * @param text PDF Text object
   * @param index The reference index of the array
   * @returns {Object}
   */
  #clearText = (text, index) => {
    text.items.splice(index, 1);
    text.items.splice(index, 1);
    text.items.splice(index, 1);
    return text;
  };
}

export { TextExtractorService };
