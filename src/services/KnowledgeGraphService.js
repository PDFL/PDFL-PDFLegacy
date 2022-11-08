const KEYWORD_API =
  "http://api.semanticscholar.org/graph/v1/paper/search?query=";
const CITATIONS_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations";
const REFERENCES_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references";

/**
 * @typedef {Object} PaperInfo
 * @property {string} paperId
 * @property {string} title
 */

/**
 * @typedef {Object} LinkedPapers
 * @property {PaperInfo[]} citations
 * @property {PaperInfo[]} references
 */

/**
 * Gets citations and references for a pdf document.
 *
 * @param {Pdfjs Document} pdfDoc
 * @returns {Promise<LinkedPapers>} linked papers of 'pdfDoc'
 */
async function getLinkedPapers(pdfDoc) {
  let metadata = await pdfDoc.getMetadata();

  console.log(metadata);

  // TODO: check if some useful ID is in the metadata

  let title = metadata.info.Title;
  if (!title) {
    console.warn("Title not in metadata!");
    // TODO: parse references from pdf text
    return [];
  }

  let currentPaperInfo = await getPaperInfo(title);
  if (currentPaperInfo.title !== title) {
    console.warn("Titles do not match!");
    // TODO: parse references from pdf text
    return [];
  }

  let paperID = currentPaperInfo.paperId;

  let [citations, references] = await Promise.all([
    getCitations(paperID),
    getReferences(paperID),
  ]);

  return {
    citations: citations,
    references: references,
  };
}

/**
 * Gets paperId and title from sem scholar API.
 *
 * @param {string} title
 * @returns {Promise<PaperInfo>}
 */
async function getPaperInfo(title) {
  let titleQuery = title.replace(" ", "+");

  let currentPaper = (await (await fetch(KEYWORD_API + titleQuery)).json())
    .data[0];
  return currentPaper;
}

/**
 * Gets papers that cite this paper from sem scholar.
 *
 * @param {string} paperID
 * @returns {Promise<PaperInfo[]>}
 */
async function getCitations(paperID) {
  let data = (
    await (await fetch(CITATIONS_API.replace("{paper_id}", paperID))).json()
  ).data;
  return data.map(({ citingPaper }) => citingPaper);
}

/**
 * Gets papers that are cited by this paper from sem scholar.
 *
 * @param {string} paperID
 * @returns {Promise<PaperInfo[]>}
 */
async function getReferences(paperID) {
  let data = (
    await (await fetch(REFERENCES_API.replace("{paper_id}", paperID))).json()
  ).data;
  return data.map(({ citedPaper }) => citedPaper);
}

module.exports = { getLinkedPapers, getCitations, getReferences, getPaperInfo };
