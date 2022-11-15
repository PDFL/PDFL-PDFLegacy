import { nodesMock, linksMock } from "../mocks/KnowledgeGaphMocks";
import { getLinkedPapers } from "../services/KnowledgeGraphService";
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
      else
        data = linkedPapers;
      
      ForceGraph()(this.components.knowledgeGraph)
        .graphData(data)
        .nodeId("id")
        .nodeAutoColorBy("group")
        .nodeCanvasObject((node, ctx, globalScale) => {
          //TODO: add custom style
          const label = node.label;
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
    });
  };
}

export { KnowledgeGraphComponent };
