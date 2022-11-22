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
  };

  setPDF = (pdfDocument) => {
    this.pdfDocument = pdfDocument;
  };

  /**
   * Displays knowledge graph.
   */
  displayGraph = () => {
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
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.6
          ); // some padding

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
        .onEngineStop(() => graph.zoomToFit(300));

      buildGraphProcedure(graph, MAX_GRAPH_DEPTH);

      graph.onNodeClick((node) => {
        // Center/zoom on node
        graph.centerAt(node.x, node.y, 1000);
        graph.zoom(4, 2000);
      });
    });
  };
}

export { KnowledgeGraphComponent };
