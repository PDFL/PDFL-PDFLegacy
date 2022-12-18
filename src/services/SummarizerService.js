import {SUMMARIZER_STOP_LIST} from "../Constants";

/**
 * Given a text this class provided the summarized version by extracting n sentences based on word frequency
 * @param text {string} text to be summarized
 * @param sentenceNumber {int} number of sentences in the summary
 */
class LocalTextSummarizer {

  /**
   * @constructor
   * @param text {string} text to be summarized
   * @param sentenceNumber {int} number of sentences in the summary
   */
  constructor(text, sentenceNumber) {
    this.text = text;
    this.sentenceNumber = sentenceNumber;
  }

  /**
   * Calculate and return the summary.
   * In the given number of sentences are less or equal the number of sentences contain in text the summarized version is returned, else, the original text is returned
   * @returns {string} summarized text
   */
  getSummary = () => {
    var documentParts = [];
    var sentences = this.text
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

    if (documentParts.length >= this.sentenceNumber) {
      var result = "";
      for(var i=0; i<this.sentenceNumber; i++){
        result = result + documentParts[i].sentence;
      }
      return result;
    } else {
      return this.text;
    }
  };
}

export { LocalTextSummarizer };
