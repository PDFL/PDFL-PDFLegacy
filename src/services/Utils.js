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

/**
 * Sets timeout of given milliseconds.
 * 
 * @param {int} ms milliseconds
 * @returns {Promise} empty promise
 */
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { compareSimilarity, timeout };
