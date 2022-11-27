import { MAX_GRAPH_DEPTH } from "../Constants";
import { nodesMock, linksMock } from "../mocks/KnowledgeGaphMocks";
import {
  buildGraphProcedure,
  fieldsOfStudyToColor,
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

  setPDF = (pdfDocument) => {
    this.pdfDocument = pdfDocument;
  };

  /**
   * Displays knowledge graph.
   */
  displayGraph = () => {
    getLinkedPapers(this.pdfDocument)
      .then((linkedPapers) => {
        let data;
        if (!linkedPapers || linkedPapers.length == 0)
          data = { nodes: nodesMock, links: linksMock };
        else data = linkedPapers;
        this.components.backgroundLoader2.className += " transparent";
        this.components.loader2.className += " move";
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

            ctx.fillStyle = fieldsOfStudyToColor(node.fieldsOfStudy);
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
          .onEngineStop(() => graph.zoomToFit(300));

        buildGraphProcedure(graph, MAX_GRAPH_DEPTH)
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
