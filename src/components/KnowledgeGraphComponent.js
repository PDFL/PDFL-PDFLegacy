import { MAX_GRAPH_DEPTH } from "../Constants";
import { nodesMock, linksMock } from "../mocks/KnowledgeGaphMocks";
import {
  buildGraphProcedure,
  getLinkedPapers,
} from "../services/KnowledgeGraphService";
/**
 * Component responsible for displaying the knowledge graph.
 *
 * @property {Object} components object that holds elements within this component
 * @property {HTMLElement} components.knowledgeGraph element in which knowledge graph will be displayed
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
    this.#registerEvents();
  }

  /**
   * Adds event listeners to component's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.graphDepth.addEventListener("change", this.#changeDepth);
  };

  /**
   * Sets new depth of knowledge graph and displays graph of that depth.
   * @private
   * @param {Event} event event triggered when new depth chosen from dropdown menu
   */
  #changeDepth = (event) => {
    const selectedDepth = parseInt(event.target.value);
    if(selectedDepth == this.depth) return;

    this.displayGraph(selectedDepth);
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
  displayGraph = (depth = 1) => {
    getLinkedPapers(this.pdfDocument).then((linkedPapers) => {
      let data;
      if (!linkedPapers || linkedPapers.length == 0)
        data = { nodes: nodesMock, links: linksMock };
      else data = linkedPapers;

      let graph = ForceGraph()(this.components.knowledgeGraph)
        .graphData(data)
        .nodeId("id")
        .nodeAutoColorBy("group")
        .nodeCanvasObject((node, ctx, globalScale) => {
          //TODO: add custom style
          const label = node.label.substring(0, 4);
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ); // some padding

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        })
        .nodePointerAreaPaint((node, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions &&
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );
        })
        .linkDirectionalArrowLength(6);

        buildGraphProcedure(graph, depth); //TODO: solve with caching
    });
  };
}

export { KnowledgeGraphComponent };
