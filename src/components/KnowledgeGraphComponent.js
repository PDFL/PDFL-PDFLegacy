import {
  buildGraphProcedure,
  getLinkedPapers,
} from "../services/KnowledgeGraphService";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

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
      await buildGraphProcedure(this.graph, selectedDepth, this.depth);
      EventHandlerService.publish(PDFLEvents.onHideSidePageLoader);
    } catch (error) {
      EventHandlerService.publish(PDFLEvents.onShowSidePageError);
    }

    this.depth = selectedDepth;
  };

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
  displayGraph = (depth) => {
    if (!depth) {
      depth = 1;
      EventHandlerService.publish(PDFLEvents.onShowOpaqueSidePageLoader);
    }

    getLinkedPapers(this.pdfDocument, depth).then((linkedPapers_tmp) => {
      if (!linkedPapers_tmp || linkedPapers_tmp.length == 0)
        return EventHandlerService.publish(PDFLEvents.onShowSidePageError);

      // cross-link node objects
      let linkedPapers = this.#findNeighbours(linkedPapers_tmp)

      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let hoverNode = null;

      const HOVERED_NODE_RADIUS = 4;


      EventHandlerService.publish(PDFLEvents.onShowTransparentSidePageLoader);

      let graph = ForceGraph()(this.components.knowledgeGraph)
        .graphData(linkedPapers)
        .nodeId("id")
        .nodeAutoColorBy("label")
        .nodeLabel(node => `${node.label}`)
        .linkColor(() => 'rgba(255,255,255,0.2)')
        .autoPauseRedraw(false) // keep redrawing after engine has stopped
        .onNodeHover(node => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (node) {
            highlightNodes.add(node);
            node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            node.links.forEach(link => highlightLinks.add(link));
          }
  
          hoverNode = node || null;
        })
        .onLinkHover(link => {
          highlightNodes.clear();
          highlightLinks.clear();
  
          if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
          }
        })
        .linkWidth(link => highlightLinks.has(link) ? 5 : 1)
        .linkDirectionalParticles(4)
        .linkDirectionalArrowLength(link => highlightLinks.has(link) ? 16 : 8)
        .linkDirectionalParticleWidth(link => highlightLinks.has(link) ? 4 : 2)
        .nodeCanvasObjectMode(node => highlightNodes.has(node) ? 'before' : undefined)
        .nodeCanvasObject((node, ctx) => {
          // add ring just for highlighted nodes
          ctx.beginPath();
          ctx.arc(node.x, node.y, HOVERED_NODE_RADIUS * 1.4, 0, 2 * Math.PI, false);
          ctx.fillStyle = node === hoverNode ? 'red' : 'orange';
          ctx.fill();
        })
        .cooldownTime(300)
        .d3Force("center", null)

        EventHandlerService.publish(PDFLEvents.onHideSidePageLoader);
        this.graph = graph;
    });
  };


  /**
   * Adds neighbours for each node.
   * @private
   */
  #findNeighbours = (linkedPapers) => {
    linkedPapers.links.forEach(link => {
      let index_a = linkedPapers.nodes.findIndex(object => {
        return object.id === link.source;
      });
      let index_b = linkedPapers.nodes.findIndex(object => {
        return object.id === link.target;
      });
      const a = linkedPapers.nodes[index_a];
      const b = linkedPapers.nodes[index_b];
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });
    return linkedPapers;
  };
}

export { KnowledgeGraphComponent };
