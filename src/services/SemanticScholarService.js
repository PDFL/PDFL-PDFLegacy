import { fetchPaperInfo, fetchPaperTldrAndAbstract } from "./Api";
import { compareSimilarity } from "./Utils";

/**
 * Get information for current paper using Semantic Scholar API
 *
 * @async
 * @param {Pdfjs Document} pdfDoc
 * @returns {GraphData} linked papers of 'pdfDoc'
 */
async function getPaperInfo(pdfDoc) {
  let metadata = await pdfDoc.getMetadata();
  let title = metadata.info.Title;
  if (!title) {
    console.warn("Title not in metadata!");
    return null;
  }

  let currentPaperInfo = await fetchPaperInfo(title);
  if (!currentPaperInfo || !compareSimilarity(currentPaperInfo.title, title)) {
    console.warn("Titles do not match!");
    return null;
  }
  return currentPaperInfo;
}

/**
 * @async
 * Get paper ID from paper info and call Abstract and TLDR fetch
 * @param pdfDoc PDF Document to search for
 * @returns {Promise<{tldr: null, abstract: null}|null>}
 */
async function getPaperTldrAndAbstract(pdfDoc) {
  let currentPaperInfo = await getPaperInfo(pdfDoc);
  if (!currentPaperInfo) {
    return null;
  }
  return fetchAndComputeTldrAndAbstract(currentPaperInfo.paperId);
}

/**
 * Fetch and prepare TLDR and abstract object to be returned
 * @param {string} paperId the ID of the paper
 * @return {Promise<{tldr: string, abstract: string}>}
 */
async function fetchAndComputeTldrAndAbstract(paperId) {
  let abstracts = await fetchPaperTldrAndAbstract(paperId);
  var texts = {
    tldr: null,
    abstract: null,
  };
  if (abstracts.tldr && abstracts.tldr.text) {
    texts.tldr = abstracts.tldr.text;
  }
  if (abstracts.abstract) {
    texts.abstract = abstracts.abstract;
  }
  return texts;
}

export {
  getPaperInfo,
  getPaperTldrAndAbstract,
  fetchAndComputeTldrAndAbstract,
};
