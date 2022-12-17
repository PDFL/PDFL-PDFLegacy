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

/*Other version below*/

const SummaryTool = require("node-summary");

/**
 * Service to create a summary of a given text and of a given number of sentences
 * @param {SummarizerManager} summarizer instance of summarizer manager object from node-summarizer library
 */
class TextSummary {
  /**
   * @constructor
   * Initialize the service with the text and the desired length
   * @param title {string} the title of content to be summarized
   * @param text {string} text to be summarized
   */
  constructor(title, text) {
    this.title = title;
    this.text = text;
  }

  /**
   * Summarize the text given in the constructor
   * @returns {Promise<{summary: string, summaryRation: float}>}
   */
  getSummary = async () => {
    const self = this;
    return new Promise((resolve) => {
      SummaryTool.summarize(self.title, self.text, function (error, summary) {
        if (error) {
          throw new Error("Unable to create summary");
        }
        resolve({
          summary: summary,
          summaryRatio:
            100 -
            100 * (summary.length / (self.title.length + self.text.length)),
        });
      });
    });
  };
}

export { TextSummary };
