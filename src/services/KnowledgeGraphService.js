import { compareSimilarity } from "./Utils";

const KEYWORD_API =
  "https://api.semanticscholar.org/graph/v1/paper/search?query=";
const CITATIONS_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations?fields=title,citationCount,influentialCitationCount";
const REFERENCES_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references?fields=title,citationCount,influentialCitationCount";

/**
 * @typedef {Object} PaperInfo
 * @property {string} paperId
 * @property {string} title
 * @property {int} citationCount
 * @property {int} influentialCitationCount
 */

/**
 * @typedef {Object} LinkedPapers
 * @property {PaperInfo[]} citations
 * @property {PaperInfo[]} references
 */

/**
 * Gets citations and references for a pdf document and the
 * reference and citation count for those papers.
 *
 * @param {Pdfjs Document} pdfDoc
 * @returns {Promise<LinkedPapers>} linked papers of 'pdfDoc'
 */
async function getLinkedPapers(pdfDoc) {
  let metadata = await pdfDoc.getMetadata();

  // TODO: check if some useful ID is in the metadata

  let title = metadata.info.Title;
  if (!title) {
    console.warn("Title not in metadata!");
    // TODO: parse references from pdf text
    return [];
  }

  let currentPaperInfo = await getPaperInfo(title);
  if (!compareSimilarity(currentPaperInfo.title, title)) {
    console.warn("Titles do not match!");
    // TODO: parse references from pdf text
    return [];
  }

  let paperID = currentPaperInfo.paperId;

  let [citations, references] = await Promise.all([
    getCitations(paperID),
    getReferences(paperID),
  ]);

  return getGraphStructure(paperID, title, references, citations);
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

/**
 * @typedef {Object} Node
 * @property {string} id
 * @property {string} label
 */

/**
 * @typedef {Object} Link
 * @property {string} id
 * @property {string} source
 * @property {string} target
 */

/**
 * @typedef {Object} GraphData
 * @property {Node[]} nodes
 * @property {Link[]} links
 */

/**
 * Returns object structure of paper's references and citations 
 * that graph generatior takes in. 
 * 
 * @param {string} paperId paper id
 * @param {string} paperTitle paper title
 * @param {PaperInfo[]} references papers that paper is referencing 
 * @param {PaperInfo[]} citations papers that are citing the paper
 * @returns {GraphData}
 */
function getGraphStructure(paperId, paperTitle, references, citations){
  let nodes = new Array();
  let links = new Array();

  nodes.push({id: paperId, label: paperTitle});

  for(let reference of references){
    nodes.push({id: reference.paperId, label: reference.title})
    links.push({id: reference.paperId + paperId, source: paperId, target: reference.paperId})
  }

  for(let citation of citations){
    nodes.push({id: citation.paperId, label: citation.title})
    links.push({id: citation.paperId + paperId, source: citation.paperId, target: paperId})
  }

  return {nodes: nodes, links: links};
}

export { getLinkedPapers, getCitations, getReferences, getPaperInfo };
