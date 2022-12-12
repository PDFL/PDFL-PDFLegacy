import { FIELD_OF_STUDY_COLOR } from "../Constants";
import { fetchCitations, fetchPaperInfo, fetchReferences } from "./Api";
import { compareSimilarity, mergeColors, timeout } from "./Utils";
import {
  setGraphData,
  hasGraphData,
  getGraphData,
  addGraphData,
} from "./KnowledgeGraphCachingService";

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
 * @returns {GraphData} linked papers of 'pdfDoc'
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

  return getCreatedGraphData(currentPaperInfo);
}

/**
 * Returns cached or fetched graph data of depth 1 for current paper.
 *
 * @param {PaperInfo} currentPaperInfo informational about current paper
 * @returns {GraphData} linked papers of 'pdfDoc'
 */
async function getCreatedGraphData(currentPaperInfo) {
  const paperId = currentPaperInfo.paperId;
  const depth = 1;

  let graphData;
  if (hasGraphData(paperId, depth)) graphData = getGraphData(paperId, depth);
  else {
    graphData = await getLinkedNodesByPaper(currentPaperInfo);
    setGraphData(paperId, depth, graphData);
  }

  return graphData;
}

/**
 * Gets linked papers (nodes) of the given paper.
 *
 * @async
 * @param {PaperInfo} paperInfo
 * @returns {Promise<GraphData>} linked papers of 'pdfDoc' or undefined on error.
 */
async function getLinkedNodesByPaper(paperInfo) {
  const [citations, references] = await Promise.all([
    getCitations(paperInfo.paperId),
    getReferences(paperInfo.paperId),
  ]);
  if (!citations) return;
  if (!references) return;


  return getGraphStructure(
    paperInfo,
    references,
    citations
  );
}

/**
 * Gets papers that cite this paper.
 *
 * @async
 * @param {string} paperID
 * @returns {Promise<PaperInfo[]>} or undefined on error.
 */
async function getCitations(paperID) {
  try {
    let data = await fetchCitations(paperID);
    return data.map(({ citingPaper }) => citingPaper);
  } catch (error) {
    return;
  }
}

/**
 * Gets papers that are cited by this paper.
 *
 * @async
 * @param {string} paperID
 * @returns {Promise<PaperInfo[]>} or undefined on error.
 */
async function getReferences(paperID) {
  try {
    let data = await fetchReferences(paperID);
    return data.map(({ citedPaper }) => citedPaper);
  } catch (error) {
    return;
  }
}

/**
 * @typedef {Object} Node
 * @property {string} id
 * @property {string} label
 * @property {string[]} fieldsOfStudy
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
 * @param {PaperInfo} paperInfo
 * @param {PaperInfo[]} references papers that paper is referencing
 * @param {PaperInfo[]} citations papers that are citing the paper
 * @returns {GraphData}
 */
function getGraphStructure(paperInfo, references, citations) {
  let nodes = new Array();
  let links = new Array();
  let paperId = paperInfo.paperId;
  nodes.push({ id: paperId, label: paperInfo.title, field: paperInfo.fieldsOfStudy, author: paperInfo.authors, fieldsOfStudy: paperInfo.fieldsOfStudy,});

  for (let reference of references) {
    if (reference.paperId && reference.paperId != "") {
      nodes.push({ id: reference.paperId, label: reference.title, field: reference.fieldsOfStudy, author: reference.authors, fieldsOfStudy: reference.fieldsOfStudy, });
      links.push({
        id: reference.paperId + paperInfo.paperId,
        source: paperInfo.paperId,
        target: reference.paperId,
      });
    }
  }

  for (let citation of citations) {
    if (citation.paperId && citation.paperId != "") {
      nodes.push({ id: citation.paperId, label: citation.title, field: citation.fieldsOfStudy, author: citation.authors, fieldsOfStudy: citation.fieldsOfStudy,  });
      links.push({
        id: citation.paperId + paperInfo.paperId,
        source: citation.paperId,
        target: paperInfo.paperId,
      });
    }
  }

  return { nodes: nodes, links: links };
}

/**
 * Builds graph of selected depth. If data of selected
 * depth is in cache it will display cached data and if
 * not it will display newly fetched data.
 *
 * @async
 * @param {ForceGraph} graph graph being displayed
 * @param {int} selectedDepth new selected depth
 */
async function buildGraphProcedure(graph, selectedDepth) {
  const paperId = graph.graphData().nodes[0].id;

  if (selectedDepth == 1) {
    buildFirstDepth(graph, paperId);
  } else if (hasGraphData(paperId, selectedDepth)) {
    buildSecondDepth(graph, paperId);
  } else {
    await buildGraphDepth(graph, paperId, selectedDepth);
    setGraphData(paperId, selectedDepth, graph.graphData());
  }
}

/**
 * Builds a graph of depth one from data in cache.
 * 
 * @param {ForceGraph} graph graph being displayed
 * @param {string} paperId id of paper being read
 */
function buildFirstDepth(graph, paperId) {
  graph.graphData(getGraphData(paperId, 1));
}

/**
 * Builds a graph of depth two from data in cache.
 * 
 * @param {ForceGraph} graph graph being displayed
 * @param {string} paperId id of paper being read
 */
function buildSecondDepth(graph, paperId) {
  addToGraph(graph, getGraphData(paperId, 2));
}

/**
 * Builds graph of given depth by fetching references and citations
 * of limited number of currently displayed nodes. This limit is
 * now ten. When data is fetched its added to current graph and
 * cached.
 *
 * @async
 * @param {ForceGraph} graph
 * @param {string} paperId
 * @param {int} depth
 */
async function buildGraphDepth(graph, paperId, depth) {
  let currentGraphData = graph.graphData();
  
  let nodeIdsInGraph = currentGraphData.nodes.map(({ id }) => id);
  for (let node of currentGraphData.nodes.slice(0, 10)) {
    if (node.id == paperId) continue;

    let linkedPapers = await getLinkedNodesByPaper({
      paperId: node.id,
      title: node.label,
    });
    linkedPapers.nodes = linkedPapers.nodes.filter(
      (n) => !nodeIdsInGraph.includes(n.id)
    );

    addToGraph(graph, linkedPapers);
    addGraphData(paperId, depth, linkedPapers);
  }
}

/**
 * Adds GraphData to a graph, this will trigger automatic
 * redisplaying of the graph, linkedNodes can contain
 * duplicates.
 *
 * Returns graph data that has been added.
 *
 * @param {ForceGraph} graph
 * @param {GraphData} linkedNodes
 * @returns {GraphData}
 */
function addToGraph(graph, linkedNodes) {
  const { nodes, links } = graph.graphData();

  let nodeIdsInGraph = nodes.map(({ id }) => id);
  let nodesToAddFiltered = linkedNodes.nodes.filter((node) => {
    return !nodeIdsInGraph.includes(node.id);
  });

  let linkIdsInGraph = links.map(({ id }) => id);
  let linksToAddFiltered = linkedNodes.links.filter((link) => {
    return !linkIdsInGraph.includes(link.id);
  });

  graph.graphData({
    nodes: nodes.concat(nodesToAddFiltered),
    links: links.concat(linksToAddFiltered),
  });

  return {
    nodes: nodesToAddFiltered,
    links: linksToAddFiltered,
  };
}

/**
 * Takes fiedlsOfStudy array that is retrieved as a paper attribute
 * from semantic scholar and returns a color which should symbolize
 * that field of study or studies.
 *
 * @param {String[]} fieldsOfStudy arrays of fields of studies
 * @returns {String} color
 */
function fieldsOfStudyToColor(fieldsOfStudy) {
  if (!fieldsOfStudy || fieldsOfStudy.length == 0) {
    return FIELD_OF_STUDY_COLOR["Missing Color"];
  }

  let colors = fieldsOfStudy.map(
    (fieldOfStudy) => FIELD_OF_STUDY_COLOR[fieldOfStudy]
  );

  return mergeColors(colors);
};

 /* Takes a node that belongs to a ForceGraph, gets it's linked
 * papers and adds them to the graph.
 *
 * @async
 * @param {Node} node
 * @param {ForceGraph} graph graph to add the new nodes
 */
async function expandNode(node, graph) {
  let expandedNodes = await getLinkedNodesByPaper({
    paperId: node.id,
    title: node.label,
  });
  addToGraph(graph, expandedNodes);
}

export {
  getLinkedPapers,
  getCitations,
  getReferences,
  buildGraphProcedure,
  fieldsOfStudyToColor,
  expandNode,
};
