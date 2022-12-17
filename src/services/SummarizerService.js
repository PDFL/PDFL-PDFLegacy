import { SummarizerManager } from "node-summarizer";

/**
 * Service to create a summary of a given text and of a given number of sentences
 * @param {SummarizerManager} summarizer instance of summarizer manager object from node-summarizer library
 */
class TextSummarizer {
  /**
   * @constructor
   * Initialize the service with the text and the desired length
   * @param text {string} text to be summarized
   * @param numberOfSentences {int} number of sentences for the resulting summary
   */
  constructor(text, numberOfSentences) {
    this.summarizer = new SummarizerManager(text, numberOfSentences);
  }

  /**
   * Get a summary using library frequency method.
   * It returns an object with the requested summary and the reduction percentage
   * @returns {{summary: string, reductionPercentage: string}}
   */
  getSummaryByFrequency = () => {
    return {
      summary: this.summarizer.getSummaryByFrequency().summary,
      reductionPercentage: this.summarizer.getFrequencyReduction().reduction,
    };
  };

  /**
   * @async
   * Get a summary using library rank method.
   * It returns an object with the requested summary and the reduction percentage
   * @returns {{summary: string, reductionPercentage: string}}
   */
  getSummaryByRank = async () => {
    let summaryObject = await this.summarizer.getSummaryByRank();
    let reductionPercentage = await this.summarizer.getRankReduction();
    return {
      summary: summaryObject.summary,
      reductionPercentage: reductionPercentage.reduction,
    };
  };
}

export { TextSummarizer };
