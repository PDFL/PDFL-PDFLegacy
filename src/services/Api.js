const KEYWORD_API = "https://api.semanticscholar.org/graph/v1/paper/search?";
const CITATIONS_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations?";
const REFERENCES_API =
  "https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references?";
const PAPER_API = "https://api.semanticscholar.org/graph/v1/paper/{paper_id}?";

const HEADERS = new Headers({
  "X-Api-Key": process.env.SEMANTIC_SCHOLAR_API_KEY,
});

const FETCH_OPTIONS = process.env.SEMANTIC_SCHOLAR_API_KEY
  ? {
      mode: "cors",
      headers: HEADERS,
    }
  : undefined;

const FIELDS_TO_FETCH_FOR_PAPER =
  "title,citationCount,influentialCitationCount,authors,fieldsOfStudy";
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
  let paper = (
    await (await fetch(KEYWORD_API + queryParams, FETCH_OPTIONS)).json()
  ).data[0];
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
  });
  let data = (
    await (
      await fetch(
        CITATIONS_API.replace("{paper_id}", paperID) + queryParams,
        FETCH_OPTIONS
      )
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
  });
  let data = (
    await (
      await fetch(
        REFERENCES_API.replace("{paper_id}", paperID) + queryParams,
        FETCH_OPTIONS
      )
    ).json()
  ).data;
  return data;
}

/**
 * Fetch the TLDR for a paper given the ID
 * @param paperID papaer id
 * @returns {Promise<Object>} the TLDR Object
 */
async function fetchPaperAbstract(paperID) {
  let queryParams = new URLSearchParams({
    fields: "abstract",
  });
  let data = (
    await (
      await fetch(
        PAPER_API.replace("{paper_id}", paperID) + queryParams,
        FETCH_OPTIONS
      )
    ).json()
  ).abstract;
  return data;
}

export { fetchPaperInfo, fetchCitations, fetchReferences, fetchPaperAbstract };
