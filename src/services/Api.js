const KEYWORD_API = "https://api.semanticscholar.org/graph/v1/paper/search?";
const CITATIONS_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations?";
const REFERENCES_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references?";

const FIELDS_TO_FETCH_FOR_PAPER =
  "title,citationCount,influentialCitationCount";

/**
 * @typedef {Object} CitedPaper
 * @property {import("./KnowledgeGraphService").PaperInfo} citedPaper
 */

/**
 * @typedef {Object} CitingPaper
 * @property {import("./KnowledgeGraphService").PaperInfo} citingPaper
 */

/**
 * Fetches paperId and title from sem scholar API.
 *
 * @param {string} titleQuery
 * @returns {Promise<import("./KnowledgeGraphService").PaperInfo>}
 */
async function fetchPaperInfo(titleQuery) {
  let queryParams = new URLSearchParams({ query: titleQuery, limit: 1 });
  let currentPaper = (await (await fetch(KEYWORD_API + queryParams)).json())
    .data[0];
  return currentPaper;
}

/**
 * Fetches papers that cite this paper from sem scholar.
 *
 * @param {string} paperID
 * @returns {Promise<CitedPaper[]>}
 */
async function fetchCitations(paperID) {
  let queryParams = new URLSearchParams({ fields: FIELDS_TO_FETCH_FOR_PAPER });
  let data = (
    await (
      await fetch(CITATIONS_API.replace("{paper_id}", paperID) + queryParams)
    ).json()
  ).data;
  return data;
}

/**
 * Fetches papers that are cited by this paper from sem scholar.
 *
 * @param {string} paperID
 * @returns {Promise<CitingPaper[]>}
 */
async function fetchReferences(paperID) {
  let queryParams = new URLSearchParams({ fields: FIELDS_TO_FETCH_FOR_PAPER });
  let data = (
    await (
      await fetch(REFERENCES_API.replace("{paper_id}", paperID) + queryParams)
    ).json()
  ).data;
  return data;
}

export { fetchPaperInfo, fetchCitations, fetchReferences };
