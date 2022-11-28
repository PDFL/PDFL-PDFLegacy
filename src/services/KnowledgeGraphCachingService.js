/**
 * @typedef {Object} GraphData
 * @property {import("./KnowledgeGraphService").GraphData}
 */

/**
 * @property {Map<string, Map<int, GraphData>>} graphDataCache map that caches GraphData by 
 * paper id and depth. First map has paper id as key and map as value. Second map has depth 
 * as key and GraphData as value.
 */
let graphDataCache = new Map();

/**
 * Sets {@link GraphData} for given depth and paper id in {@link graphDataCache}. If there is 
 * existing data for this paper id and depth combination this function will overwrite it with
 * given data.
 * 
 * @param {string} paperId id of paper
 * @param {int} depth graph depth
 * @param {GraphData} data graph data
 */
function setGraphData (paperId, depth, data) {
  if (!graphDataCache.has(paperId)) graphDataCache.set(paperId, new Map());

  graphDataCache.get(paperId).set(depth, data);
};

/**
 * Adds nodes and links of given {@link GraphData} to {@link graphDataCache} for given paper id
 * and depth combination. This function will not overwrite existing data, but
 * simly add to it. If there is no data on given depth and paper id combination
 * this function will call {@link setGraphData} function.
 * 
 * @param {string} paperId paper id
 * @param {int} depth graph depth
 * @param {GraphData} data graph data
 */
function addGraphData (paperId, depth, data) {
  if (!hasGraphData(paperId, depth))
    setGraphData(paperId, depth, data);

  const nodes = data.nodes;
  let existingNodesAtDepth = graphDataCache.get(paperId).get(depth).nodes;
  for(let node of nodes)
    if(!existingNodesAtDepth.find(n => n.id === node.id))
      existingNodesAtDepth.push(node)
  
  const links = data.links;
  let existingLinksAtDepth = graphDataCache.get(paperId).get(depth).links;
  for(let link of links)
    if(!existingLinksAtDepth.find(l => l.id === link.id))
      existingLinksAtDepth.push(link)
  
};

/**
 * Returns true if there is existing {@link GraphData} for given paper id
 * and depth in {@link graphDataCache}.
 * 
 * @param {string} paperId paper id
 * @param {int} depth graph depth
 * @returns {Boolean}
 */
function hasGraphData (paperId, depth) {
  return graphDataCache.has(paperId) && graphDataCache.get(paperId).has(depth);
};

/**
 * Returns {@link GraphData} from {@link graphDataCache} for given paper id
 * and depth combination,
 * 
 * @param {string} paperId paper id
 * @param {int} depth graph depth
 * @returns {GraphData}
 */
function getGraphData (paperId, depth) {
  return graphDataCache.get(paperId).get(depth);
};

export { setGraphData , addGraphData , hasGraphData, getGraphData };
