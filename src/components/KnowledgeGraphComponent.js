import {
  buildGraphProcedure,
  getLinkedPapers,
  expandNode,
  Node,
  Link,
  GraphData,
} from "../services/KnowledgeGraphService";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";
import { TRANSPARENT_WHITE } from "../Constants";
import ForceGraph from "force-graph";

/**
 * Component responsible for displaying the knowledge graph.
 *
 * @property {Object} components object that holds elements within this component
 * @property {HTMLElement} components.knowledgeGraph element in which knowledge graph will be displayed
 * @property {HTMLElement} components.graphDepth input element for depth selection
 * @property {int} depth depth of knowledge graph
 */
class KnowledgeGraphComponent {
  components = {
    knowledgeGraph: document.querySelector("#knowledge-graph"),
    graphDepth: document.querySelector("#graph-depth"),
  };

  /**
   * Creates and initializes new knowledge graph component. Sets depth
   * of knowledge graph to 1.
   *
   * @constructor
   */
  constructor() {
    this.depth = 1;

    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.graphDepth.addEventListener("change", this.#depthSelected);
  };

  /**
   * Called when user selects a depth from dropdown menu.
   *
   * @private
   * @param {Event} event event triggered when depth chosen from dropdown menu
   */
  #depthSelected = (event) => {
    const selectedDepth = parseInt(event.target.value);
    if (selectedDepth == this.depth) return;

    this.#changeDepth(selectedDepth);
  };

  /**
   * Sets new depth of knowledge graph and displays graph of that depth.
   *
   * @private
   * @param {int} selectedDepth new depth
   */
  async #changeDepth(selectedDepth) {
    try {
      EventHandlerService.publish(PDFLEvents.onShowTransparentSidePageLoader);
      await buildGraphProcedure(this.graph, selectedDepth);
      EventHandlerService.publish(PDFLEvents.onHideSidePageLoader);
    } catch (error) {
      EventHandlerService.publish(PDFLEvents.onShowSidePageError);
    }

    this.depth = selectedDepth;
  }

  /**
   * Setter for PDF document from which knowledge graph will be generated.
   * @param {PDFDocumentProxy} pdfDocument PDF document
   */
  setPDF = (pdfDocument) => {
    this.pdfDocument = pdfDocument;
  };

  /**
   * Displays knowledge graph.
   */
  displayGraph = (depth = 1) => {
    EventHandlerService.publish(PDFLEvents.onShowOpaqueSidePageLoader);

    getLinkedPapers(this.pdfDocument, depth).then((linkedPapers) => {
      if (!linkedPapers || linkedPapers.length == 0)
        return EventHandlerService.publish(PDFLEvents.onShowSidePageError);

      EventHandlerService.publish(PDFLEvents.onShowTransparentSidePageLoader);

      this.graph = this.#createForceGraph(linkedPapers);

      EventHandlerService.publish(PDFLEvents.onHideSidePageLoader);
    });
  };

  /**
   * Creates and returns custom styled force graph.
   * 
   * @param {GraphData} linkedPapers nodes and links in graph
   * @returns {ForceGraph}
   */
  #createForceGraph(linkedPapers) {
    const highlightNodes = new Set();
    const highlightLinks = new Set();
    let hoveredNode;

    return ForceGraph()(this.components.knowledgeGraph)
      .graphData(linkedPapers)
      .nodeId("id")
      .nodeAutoColorBy("label")
      .nodeLabel((node) => `${node.label}`)
      .linkColor(() => TRANSPARENT_WHITE)
      .autoPauseRedraw(false) // keep redrawing after engine has stopped
      .onNodeClick((node) => {
        expandNode(node, this.graph);
      })
      .onNodeHover((node) => { hoveredNode = this.#highlightConnectedNodes(highlightNodes, highlightLinks, node)})
      .onLinkHover((link) => this.#highlightLink(highlightNodes, highlightLinks, link))
      .linkWidth((link) => this.#getLinkWidth(highlightLinks, link))
      .linkDirectionalParticles(4)
      .linkDirectionalArrowLength((link) => this.#getArrowLength(highlightLinks, link))
      .linkDirectionalParticleWidth((link) => this.#getParticleWidth(highlightLinks, link))
      .linkDirectionalParticleSpeed(0.001)
      .nodeCanvasObjectMode((node) => this.#getNodeMode(highlightNodes, node))
      .nodeCanvasObject((node, ctx) => this.#displayHighlightedNode(hoveredNode, node, ctx))
      .cooldownTime(300)
      .onEngineStop(() => this.graph.zoomToFit(500))
      .d3Force("center", null);
  }

  /**
   * Highlights newly hovered node and all of it's links and nodes
   * that are connected to that node over links. Clears old
   * highlighted nodes and links sets and finds new links and nodes
   * connected to newly hovered node.
   *
   * @param {Set<Node>} highlightNodes currently highlighted nodes
   * @param {Set<Link>} highlightLinks currently highlighted links
   * @param {Node} node node currently being hovered
   * @returns {Node} styled ForceGraph's node that is being hovered
   */
  #highlightConnectedNodes(highlightNodes, highlightLinks, node) {
    highlightNodes.clear();
    highlightLinks.clear();

    if (node) {
      let graphData = this.graph.graphData();

      let nodeLinks = this.#findNodesLinks(graphData, node, highlightLinks);
      nodeLinks.forEach((l) => highlightLinks.add(l));

      let connectedNodes = this.#findHighlightedNodes(
        nodeLinks,
        node,
        graphData,
        highlightNodes
      );
      connectedNodes.push(node);
      connectedNodes.forEach((n) => highlightNodes.add(n));
    }
    return node;
  }

  /**
   * Returns array of nodes that are connected to given node
   * over links of that node. For every link it's source/target
   * is checked and if source/target of that link is current link
   * then that link's target/source node if found in current graph
   * data and finally all such nodes are returned in array.
   *
   * @param {Array<Link>} nodeLinks all links connected to hovered node
   * @param {Node} node node that is being hovered over
   * @param {GraphData} graphData current graph data
   * @returns {Array<Node>} nodes connected to node over links
   */
  #findHighlightedNodes(nodeLinks, node, graphData) {
    return nodeLinks.map((l) => {
      if (l.source.id == node.id)
        return graphData.nodes.find((n) => n.id == l.target.id);
      return graphData.nodes.find((n) => n.id == l.source.id);
    });
  }

  /**
   * Returns array of  links that are connected to given node.
   * Link is connected to node if link's target or source id is
   * equal to node id.
   *
   * @param {GraphData} graphData current graph data
   * @param {Node} node node that is being hovered over
   * @returns {Array<Link>} links connected to node
   */
  #findNodesLinks(graphData, node) {
    return graphData.links.filter(
      (l) => l.source.id == node.id || l.target.id == node.id
    );
  }

  /**
   * Highlights a link. Adds link to highlighted links set and nodes
   * it connects to highlighted nodes set.
   *
   * @param {Set<Node>} highlightNodes  set of highlighted nodes
   * @param {Set<Link>} highlightLinks set of highlighted links
   * @param {Link} link link being hovered over
   * @returns {Link} styled ForceGraph's link
   */
  #highlightLink(highlightNodes, highlightLinks, link) {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    return link;
  }

  /**
   * Returns link width depending if link is highlighted. If it is
   * highlighted returns 5 and 1 otherwise.
   *
   * @param {Set<Link>} highlightLinks set of highlighted links
   * @param {Link} link link being processed
   * @returns {int} link width
   */
  #getLinkWidth(highlightLinks, link) {
    return this.#isLinkHighlighted(highlightLinks, link) ? 5 : 1;
  }

  /**
   * Returns length of directional arrow depending if link is highlighted.
   * If link is hovered returns 16 and 8 otherwise.
   *
   * @param {Set<Link>} highlightLinks set of highlighted links
   * @param {Link} link link being processed
   * @returns {int} directional arrow length
   */
  #getArrowLength(highlightLinks, link) {
    return this.#isLinkHighlighted(highlightLinks, link) ? 16 : 8;
  }

  /**
   * Returns width of directional particle depending if link is highlighted.
   * If link is hovered returns 4 and 2 otherwise.
   *
   * @param {Set<Link>} highlightLinks set of highlighted links
   * @param {Link} link link being processed
   * @returns {int} directional particle width
   */
  #getParticleWidth(highlightLinks, link) {
    return this.#isLinkHighlighted(highlightLinks, link) ? 4 : 2;
  }

  /**
   * Returns true if link is in highlighted links.
   *
   * @param {Set<Link>} highlightLinks set of highlighted links
   * @param {Link} link link in graph
   * @returns {boolean}
   */
  #isLinkHighlighted(highlightLinks, link) {
    return highlightLinks.has(link);
  }

  /**
   * Returns node mode depending if highlighted. If node is
   * highlighted returns "before" and undefined otherwise.
   *
   * @param {Set<Node>} highlightNodes set of highlighted nodes
   * @param {Node} node node being processed
   * @returns {string} node mode
   */
  #getNodeMode(highlightNodes, node) {
    return highlightNodes.has(node) ? "before" : undefined;
  }

  /**
   * Sets style of ring around node depending if node is highlighted or not.
   *
   * @param {Node} hoveredNode last hovered node
   * @param {Node} node node being processed
   * @param {Object} ctx canvas context of node
   * @returns {(Node, Object)} ForceGraph's styled node and context
   */
  #displayHighlightedNode(hoveredNode, node, ctx) {
    const nodeRadius = 4;
    // add ring just for highlighted nodes
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius * 1.4, 0, 2 * Math.PI, false);
    ctx.fillStyle = hoveredNode && node.id === hoveredNode.id ? "red" : "orange";
    ctx.fill();
    return node, ctx;
  }
}

export { KnowledgeGraphComponent };
