var { compareTwoStrings } = require("string-similarity");
import { SIMILARITY_THRESHOLD } from "../Constants";

/**
 * Compares 2 string based on similarity.
 *
 * @param {string} string1
 * @param {string} string2
 * @returns {boolean}
 */
function compareSimilarity(string1, string2) {
  return SIMILARITY_THRESHOLD < compareTwoStrings(string1, string2);
}

function mouseOverDelayEvent(element, delay = 2000, callback) {
  var timeout = null;
  element.addEventListener("mouseover", function (event) {
    timeout = setTimeout(function () {
      callback(event);
    }, delay);
  });

  element.addEventListener("mouseout", function () {
    clearTimeout(timeout);
  });
}

export { compareSimilarity, mouseOverDelayEvent };
