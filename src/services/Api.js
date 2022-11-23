import { MAX_CITATION, MAX_REFERENCES } from "../Constants";

const KEYWORD_API = "https://api.semanticscholar.org/graph/v1/paper/search?";
const CITATIONS_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations?";
const REFERENCES_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references?";

const FIELDS_TO_FETCH_FOR_PAPER =
  "title,citationCount,influentialCitationCount,fieldsOfStudy";

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
 * Returns null if no match is found.
 *
 * @async
 * @param {string} titleQuery
 * @returns {Promise<import("./KnowledgeGraphService").PaperInfo>}
 */
async function fetchPaperInfo(titleQuery) {
  let queryParams = new URLSearchParams({
    query: titleQuery,
    limit: 1,
    fields: FIELDS_TO_FETCH_FOR_PAPER,
  });
  let paper = (await (await fetch(KEYWORD_API + queryParams)).json()).data[0];
  return paper;
}

/**
 * Fetches papers that cite this paper from sem scholar.
 *
 * @async
 * @param {string} paperID
 * @returns {Promise<CitedPaper[]>}
 */
async function fetchCitations(paperID) {
  let queryParams = new URLSearchParams({
    fields: FIELDS_TO_FETCH_FOR_PAPER,
    limit: MAX_CITATION,
  });
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
 * @async
 * @param {string} paperID
 * @returns {Promise<CitingPaper[]>}
 */
async function fetchReferences(paperID) {
  let queryParams = new URLSearchParams({
    fields: FIELDS_TO_FETCH_FOR_PAPER,
    limit: MAX_REFERENCES,
  });
  let data = (
    await (
      await fetch(REFERENCES_API.replace("{paper_id}", paperID) + queryParams)
    ).json()
  ).data;
  return data;
}

export { fetchPaperInfo, fetchCitations, fetchReferences };
