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
 * Attach a mouseOver and mouseOut event to a DOM Object to delay the execution of the callback of a given delay.
 * in the mouse os moveed out before the timer fires then the execution of the callback is canceled.
 *
 * @param {HTMLElement} element
 * @param {float} delay
 * @returns {function} callback
 */
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

/**
 * Sets timeout of given milliseconds.
 * 
 * @param {int} ms milliseconds
 * @returns {Promise} empty promise
 */
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { compareSimilarity, timeout, mouseOverDelayEvent };
