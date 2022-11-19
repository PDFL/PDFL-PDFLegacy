import { fetchCitations, fetchPaperInfo, fetchReferences } from "./Api";
import { compareSimilarity } from "./Utils";

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
 * @async
 * @param {Pdfjs Document} pdfDoc
 * @returns {Promise<GraphData>} linked papers of 'pdfDoc'
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

  let currentPaperInfo = await fetchPaperInfo(title);
  if (!currentPaperInfo || !compareSimilarity(currentPaperInfo.title, title)) {
    console.warn("Titles do not match!");
    // TODO: parse references from pdf text
    return [];
  }

  return await getLinkedNodesByPaper(currentPaperInfo);
}

/**
 * Gets linked papers (nodes) of the given paper.
 *
 * @async
 * @param {PaperInfo} paperInfo
 * @returns {Promise<GraphData>} linked papers of 'pdfDoc'
 */
async function getLinkedNodesByPaper(paperInfo) {
  let [citations, references] = await Promise.all([
    getCitations(paperInfo.paperId),
    getReferences(paperInfo.paperId),
  ]);

  return getGraphStructure(
    paperInfo.paperId,
    paperInfo.title,
    references,
    citations
  );
}

/**
 * Gets papers that cite this paper.
 *
 * @async
 * @param {string} paperID
 * @returns {Promise<PaperInfo[]>}
 */
async function getCitations(paperID) {
  let data = await fetchCitations(paperID);
  return data.map(({ citingPaper }) => citingPaper);
}

/**
 * Gets papers that are cited by this paper.
 *
 * @async
 * @param {string} paperID
 * @returns {Promise<PaperInfo[]>}
 */
async function getReferences(paperID) {
  let data = await fetchReferences(paperID);
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
function getGraphStructure(paperId, paperTitle, references, citations) {
  let nodes = new Array();
  let links = new Array();

  nodes.push({ id: paperId, label: paperTitle });

  for (let reference of references) {
    if (reference.paperId && reference.paperId != "") {
      nodes.push({ id: reference.paperId, label: reference.title });
      links.push({
        id: reference.paperId + paperId,
        source: paperId,
        target: reference.paperId,
      });
    }
  }

  for (let citation of citations) {
    if (citation.paperId && citation.paperId != "") {
      nodes.push({ id: citation.paperId, label: citation.title });
      links.push({
        id: citation.paperId + paperId,
        source: citation.paperId,
        target: paperId,
      });
    }
  }

  return { nodes: nodes, links: links };
}

/**
 * Keeps adding nodes to Knowledge graph procedurally.
 * Input should be a graph with depth 1.
 *
 * @async
 * @param {ForceGraph} graph
 * @param {Number} maxDepth
 */
async function buildGraphProcedure(graph, maxDepth) {
  let nodesToExpand = graph.graphData();
  await buildGraphDepth(graph, nodesToExpand, 1, maxDepth);
}

/**
 * Recursive function which adds nodes to a Knowledge Graph.
 * For maxDepth 2, it will add the next depth (nodesToAdd),
 * for maxDepth 3, it will add that and the the linked papers
 * of nodesToAdd.
 *
 * @async
 * @param {ForceGraph} graph
 * @param {GraphData} nodesToAdd
 * @param {Number} depth
 * @param {Number} maxDepth
 */
async function buildGraphDepth(graph, nodesToAdd, depth, maxDepth) {
  if (depth == maxDepth) return;

  let nodesToAddNextDepth = [];
  for (let node of nodesToAdd.nodes) {
    let linkedPapers = await getLinkedNodesByPaper({
      paperId: node.id,
      title: node.label,
    });
    linkedPapers.re;
    addToGraph(graph, linkedPapers);
    nodesToAddNextDepth.push(linkedPapers);
  }

  for (let nodesToExpand of nodesToAddNextDepth) {
    await buildGraphDepth(graph, nodesToExpand, depth + 1, maxDepth);
  }
}

/**
 * Adds GraphData to a graph, this will trigger automatic
 * redisplaying of the graph, linkedNodes can contain
 * duplicates.
 *
 * @param {ForceGraph} graph
 * @param {GraphData} linkedNodes
 */
function addToGraph(graph, linkedNodes) {
  const { nodes, links } = graph.graphData();

  let nodeIdsInGraph = nodes.map(({ id }) => id);
  let nodeToAddFiltered = linkedNodes.nodes.filter((node) => {
    return !nodeIdsInGraph.includes(node.id);
  });

  let linkIdsInGraph = links.map(({ id }) => id);
  let linksToAddFiltered = linkedNodes.links.filter((link) => {
    return !linkIdsInGraph.includes(link.id);
  });

  graph.graphData({
    nodes: nodes.concat(nodeToAddFiltered),
    links: links.concat(linksToAddFiltered),
  });
}

export { getLinkedPapers, getCitations, getReferences, buildGraphProcedure };
