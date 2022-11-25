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
    graphDepth:
      document.querySelector(
        "#graph-depth"
      ) /* query selector for setting graph dept */,
    loader2:
      document.querySelector(
        "#loader-2"
      ) /* query selector for loader for graph */,
    backgroundLoader2: document.querySelector(
      "#background-loader-2"
    ) /* query selector for the brackground of the loader of the graph */,
    errorMessageDiv:
      document.querySelector(
        "#error-message-div"
      ) /* query selector for the brackground of the div for error message */,
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
    this.components.backgroundLoader2.className -= " transparent";
    // loader stay in the center for now this.components.loader2.className -= " move";
    this.displayGraph(selectedDepth)
      .then(() => {
        this.components.backgroundLoader2.className += " hidden";
      })
      .catch((err) => {
        console.log(err.message);
        this.components.loader2.className += " hidden";
        this.components.backgroundLoader2.className += " error";
        this.components.errorMessageDiv.className += " visualize";
      });
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
    getLinkedPapers(this.pdfDocument)
      .then((linkedPapers) => {
        let data;
        if (!linkedPapers || linkedPapers.length == 0)
          data = { nodes: nodesMock, links: linksMock };
        else data = linkedPapers;
        this.components.backgroundLoader2.className += " transparent";
        // loader stay in the center for now this.components.loader2.className += " move";
        let graph = ForceGraph()(this.components.knowledgeGraph)
          .graphData(data)
          .nodeId("id")
          .nodeAutoColorBy("group")
          .nodeCanvasObject((node, ctx, globalScale) => {
            const label = node.label.substring(0, 4);
            const fontSize = 14 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.6
            );

            ctx.fillStyle = "#489c8a";
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.textWidth = "900";
            ctx.fillStyle = "white";
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
          .linkCurvature(0.06)
          .linkDirectionalArrowLength(7)
          .linkDirectionalArrowRelPos(0.5)
          .linkDirectionalParticles(1)
          .linkDirectionalParticleWidth(5)
          .linkDirectionalParticleColor(["#2980b9"])
          .linkDirectionalArrowColor(["#2980b9"])
          .cooldownTime(300)
          .d3Force("center", null)
          .onEngineStop(() => graph.zoomToFit(500));

        buildGraphProcedure(graph, depth) //TODO: solve with caching
          .then(() => {
            this.components.backgroundLoader2.className += " hidden";
          })
          .catch((err) => {
            console.log(err.message);
            this.components.loader2.className += " hidden";
            this.components.backgroundLoader2.className += " error";
            this.components.errorMessageDiv.className += " visualize";
          });

        graph.onNodeClick((node) => {
          // Center/zoom on node
          graph.centerAt(node.x, node.y, 1000);
          graph.zoom(4, 2000);
        });
      })
      .catch((err) => {
        console.log(err.message);
        this.components.loader2.className += " hidden";
        this.components.backgroundLoader2.className += " error";
        this.components.errorMessageDiv.className += " visualize";
      });
  };
}

export { KnowledgeGraphComponent };
