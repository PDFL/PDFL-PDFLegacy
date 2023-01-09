import {
  setGraphData,
  addGraphData,
  hasGraphData,
  getGraphData,
} from "../src/services/KnowledgeGraphCachingService";

let paperId = "97d9b9119bffc8b3bdd8859f88c52ead021a1b27";
let graphData;

beforeEach(() => {
  graphData = {
    nodes: [
      {
        id: "97d9b9119bffc8b3bdd8859f88c52ead021a1b27",
      },
      {
        id: "30fd4d7c389fd9a9765afd3861019590a3d0c365",
      },
      {
        id: "f824d66e1a886817de68b62efacce15fd2c76097",
      },
    ],
    links: [
      {
        id: "30fd4d7c389fd9a9765afd3861019590a3d0c36597d9b9119bffc8b3bdd8859f88c52ead021a1b27",
        source: {
          id: "97d9b9119bffc8b3bdd8859f88c52ead021a1b27",
        },
        target: {
          id: "30fd4d7c389fd9a9765afd3861019590a3d0c365",
        },
      },
      {
        id: "f824d66e1a886817de68b62efacce15fd2c7609797d9b9119bffc8b3bdd8859f88c52ead021a1b27",
        source: {
          id: "97d9b9119bffc8b3bdd8859f88c52ead021a1b27",
        },
        target: {
          id: "f824d66e1a886817de68b62efacce15fd2c76097",
        },
      },
    ],
  };
});

afterEach(() => {
  setGraphData(paperId, 1, null);
});

test("Tests KnowledgeGraphCachingService.hasGraphData, empty cache has no graph data", async () => {
  expect(hasGraphData(paperId, 1)).toBe(false);
});

test("Tests KnowledgeGraphCachingService.setGraphData & hasGraphData, graph data set to given graph data", async () => {
  setGraphData(paperId, 1, graphData);
  expect(hasGraphData(paperId, 1)).toBe(true);
});

test("Tests KnowledgeGraphCachingService.setGraphData & getGraphData, setting graph data for existing depth overrides existing data", async () => {
  setGraphData(paperId, 1, graphData);
  const existingData = getGraphData(paperId, 1);
  expect(existingData).toBe(graphData);

  setGraphData(paperId, 1, null);
  expect(getGraphData(paperId, 1)).toEqual(null);
});

test("Tests KnowledgeGraphCachingService.setGraphData & getGraphData, setting graph data for existing depth overrides existing data", async () => {
  setGraphData(paperId, 1, graphData);
  const existingData = getGraphData(paperId, 1);
  expect(existingData).toBe(graphData);

  setGraphData(paperId, 1, null);
  expect(getGraphData(paperId, 1)).toEqual(null);
});

test("Tests KnowledgeGraphCachingService.addGraphData, adding new node and link to existing cache only adds that data to graph data", async () => {
  setGraphData(paperId, 1, graphData);

  const newGraphData = JSON.parse(JSON.stringify(graphData));

  const newNode = {
    id: "e1103d528d874a9e8e84ca443fe3fd5c1ff9eb9e",
  };
  const newLink = {
    id: "e1103d528d874a9e8e84ca443fe3fd5c1ff9eb9e97d9b9119bffc8b3bdd8859f88c52ead021a1b27",
    source: {
      id: "97d9b9119bffc8b3bdd8859f88c52ead021a1b27",
    },
    target: {
      id: "e1103d528d874a9e8e84ca443fe3fd5c1ff9eb9e",
    },
  };
  const dataToAdd = {
    nodes: [newNode],
    links: [newLink],
  };

  addGraphData(paperId, 1, dataToAdd);
  newGraphData.nodes.push(newNode);
  newGraphData.links.push(newLink);

  expect(getGraphData(paperId, 1)).toEqual(newGraphData);
});