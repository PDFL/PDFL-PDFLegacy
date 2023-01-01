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

/**
 * Takes an array of colors by string and merges them into
 * one color. Averages out the r,g and b components.
 *
 * @param {String[]} colors (i.e. 'rgba(255, 46, 46, 0.8)')
 * @returns {String} averaged color
 */
function mergeColors(colors) {
  let totalRComponent = 0;
  let totalGComponent = 0;
  let totalBComponent = 0;
  let totalAComponent = 0;
  for (let color of colors) {
    let fourParts = color.split(" ");
    totalRComponent += parseInt(fourParts[0].substring(5));
    totalGComponent += parseInt(fourParts[1]);
    totalBComponent += parseInt(fourParts[2]);
    totalAComponent += parseFloat(fourParts[3]);
  }
  let r = totalRComponent / colors.length;
  let g = totalGComponent / colors.length;
  let b = totalBComponent / colors.length;
  let a = totalAComponent / colors.length;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Triggers callback when the element enters or exits the viewport.
 *
 * @param {HTMLElement} element
 * @param {CallableFunction} callback
 */
function respondToVisibility(element, callback) {
  var options = {
    threshold: [0],
  };

  var observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      callback(entry.intersectionRatio > 0);
    });
  }, options);

  observer.observe(element);
}

export {
  compareSimilarity,
  timeout,
  mouseOverDelayEvent,
  mergeColors,
  respondToVisibility,
};
