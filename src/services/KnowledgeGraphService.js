import { FIELD_OF_STUDY_COLOR } from "../Constants";
import { fetchCitations, fetchPaperInfo, fetchReferences } from "./Api";
import { compareSimilarity, mergeColors, timeout } from "./Utils";
import {
  setGraphData,
  hasGraphData,
  getGraphData,
  addGraphData,
} from "./KnowledgeGraphCachingService";
import { TEN_MILLISECONDS } from "../Constants";

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
async function getLinkedPapers(pdfDoc, depth) {
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

  return getGraphStructure(paperInfo, references, citations);
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

  nodes.push({
    id: paperInfo.paperId,
    label: paperInfo.title,
    fieldsOfStudy: paperInfo.fieldsOfStudy,
  });

  for (let reference of references) {
    if (reference.paperId && reference.paperId != "") {
      nodes.push({
        id: reference.paperId,
        label: reference.title,
        fieldsOfStudy: reference.fieldsOfStudy,
      });
      links.push({
        id: reference.paperId + paperInfo.paperId,
        source: paperInfo.paperId,
        target: reference.paperId,
      });
    }
  }

  for (let citation of citations) {
    if (citation.paperId && citation.paperId != "") {
      nodes.push({
        id: citation.paperId,
        label: citation.title,
        fieldsOfStudy: citation.fieldsOfStudy,
      });
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
 * Keeps adding/removing nodes to Knowledge graph procedurally with
 * existing data in cache or newly fetched data.
 * If old depth is smaller than selected depth nodes will be added
 * to graph, otherwise nodes will be removed.
 *
 * @async
 * @param {ForceGraph} graph graph being displayed
 * @param {int} selectedDepth new selected depth
 * @param {int} oldDepth previously selected depth
 */
async function buildGraphProcedure(graph, selectedDepth, oldDepth) {
  const paperId = graph.graphData().nodes[0].id;

  if (hasGraphData(paperId, selectedDepth)) {
    if (oldDepth > selectedDepth) removeNodes(graph, paperId, selectedDepth);
    else await addExistingDataToGraph(graph, oldDepth, selectedDepth, paperId);
  } else {
    await buildGraphDepth(graph, paperId, selectedDepth, oldDepth);
    setGraphData(paperId, selectedDepth, graph.graphData());
  }
}

/**
 * Removes nodes that are on depths higher than new depth
 * which user selected.
 *
 * @param {ForceGraph} graph graph being displayed
 * @param {int} paperId id of paper for which graph is being displayed
 * @param {int} selectedDepth new selected depth smaller than one being currently displayed
 */
function removeNodes(graph, paperId, selectedDepth) {
  graph.graphData(getGraphData(paperId, 1));
  for (let i = 2; i <= selectedDepth; i++)
    addToGraph(graph, getGraphData(paperId, i));
}

/**
 * Adds cached graph data to graph one node at time. For better UX
 * after each node is added timeout of 10 ms is called.
 *
 * @param {ForceGraph} graph graph being displayed
 * @param {int} oldDepth previously selected depth
 * @param {int} selectedDepth selected depth
 * @param {string} paperId id of paper for which graph is being displayed
 */
async function addExistingDataToGraph(graph, oldDepth, selectedDepth, paperId) {
  let currentData = structuredClone(graph.graphData());

  for (let i = oldDepth + 1; i <= selectedDepth; i++) {
    let data = structuredClone(getGraphData(paperId, i));

    for (let node of data.nodes) {
      if (currentData.nodes.find((n) => n.id == node.id)) continue;

      let links = new Array();
      for (let link of data.links) {
        let source = currentData.nodes.find((n) => n.id == link.source.id);
        let target = currentData.nodes.find((n) => n.id == link.target.id);

        if (
          !currentData.links.find((l) => l.id == link.id) &&
          ((link.source.id == node.id && target) ||
            (link.target.id == node.id && source))
        ) {
          if (source) link.source = source;
          if (target) link.target = target;
          links.push(link);
        }
      }

      currentData.nodes.push(node);
      currentData.links.push(...links);

      graph.graphData(currentData);

      await timeout(TEN_MILLISECONDS);
    }
  }
}

/**
 * Builds graph of given depth. This recursion builds graph depth by depth beginning with
 * given depth. For given depth graph data will be fetched for external service. If there is
 * no cached data on depth lower than given, data for that depth will be fetched and added to graph,
 * this repeats recursively for all lower depths with no data in cache.
 *
 * @param {ForceGraph} graph
 * @param {string} paperId
 * @param {int} depth
 * @param {int} oldDepth
 */
async function buildGraphDepth(graph, paperId, depth, oldDepth) {
  let graphDataLowerLevel = getGraphData(paperId, depth - 1);
  if (!graphDataLowerLevel) {
    await buildGraphDepth(graph, paperId, depth - 1, depth);
    graphDataLowerLevel = getGraphData(paperId, depth - 1);
  } else if (lowerDepthNotDisplayed(oldDepth, depth)) {
    for (let d = oldDepth + 1; d < depth; d++)
      await addExistingDataToGraph(graph, d - 1, d, paperId);
  }

  let nodeIdsInGraph = graphDataLowerLevel.nodes.map(({ id }) => id);
  let limit =
    graphDataLowerLevel.nodes.length > 10
      ? 10
      : graphDataLowerLevel.nodes.length;
  let counter = 0;
  for (let node of graphDataLowerLevel.nodes) {
    if (node.id == paperId) continue;
    if (++counter > limit) break;

    let linkedPapers = await getLinkedNodesByPaper({
      paperId: node.id,
      title: node.label,
    });
    linkedPapers.re;
    linkedPapers.nodes = linkedPapers.nodes.filter(
      (n) => !nodeIdsInGraph.includes(n.id)
    );

    addToGraph(graph, linkedPapers);
    addGraphData(paperId, depth, linkedPapers);
  }
}

/**
 * Returns true if depth one lower than new depth is not
 * equal to current depth. This also means that data of
 * depth one lower than new depth is not displayed in
 * current graph.
 *
 * @param {int} oldDepth current graph depth
 * @param {int} depth new graph depth that will be displayed
 * @returns
 */
function lowerDepthNotDisplayed(oldDepth, depth) {
  return oldDepth < depth && oldDepth != depth - 1;
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
    return FIELD_OF_STUDY_COLOR["MISSING_COLOR"];
  }

  let colors = fieldsOfStudy.map(
    (fieldOfStudy) => FIELD_OF_STUDY_COLOR[fieldOfStudy]
  );

  return mergeColors(colors);
}

export {
  getLinkedPapers,
  getCitations,
  getReferences,
  buildGraphProcedure,
  fieldsOfStudyToColor,
};
