import { SUMMARIZER_STOP_LIST } from "../Constants";

/**
 * @param text {string} text to be summarized
 * @param sentenceNumber {int} number of sentences for the summarized version
 * Calculate and return the summary of a given text in a defined number of sentences.
 * In the given number of sentences are less or equal the number of sentences contain in text the summarized version is returned, else, the original text is returned
 * @returns {string} summarized text
 */
function textSummarizer(text, sentenceNumber) {
  var documentParts = [];
  var sentences = text
    .replace(/\.+/g, ".|")
    .replace(/\?/g, "?|")
    .replace(/\!/g, "!|")
    .split("|");
  sentences.pop();
  sentences.forEach(function (sentence) {
    const wordArray = sentence.split(" ").filter(function (word) {
      return SUMMARIZER_STOP_LIST.indexOf(word) === -1;
    });
    documentParts.push({
      sentence: sentence,
      words: wordArray,
      score: 0,
    });
  });
  documentParts.forEach(function (part) {
    var count = 0;
    part.words.forEach(function (word) {
      const match = word;
      documentParts.forEach(function (part2) {
        part2.words.forEach(function (word2) {
          if (word2 === match) count++;
        });
      });
    });
    count = count / part.words.length;
    part.frequency = count;
  });

  documentParts.sort(function (a, b) {
    return b.frequency - a.frequency;
  });

  if (documentParts.length >= sentenceNumber) {
    var result = "";
    for (var i = 0; i < sentenceNumber; i++) {
      result = result + documentParts[i].sentence;
    }
    return result;
  } else {
    return text;
  }
}

export { textSummarizer };
