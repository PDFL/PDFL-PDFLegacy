const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.resolve(__dirname, "../src/templates/index.html"),
  "utf8"
);

import { KnowledgeGraphComponent } from "../src/components/KnowledgeGraphComponent";

test("testing", () => {
  document.documentElement.innerHTML = html.toString();

  let graph = new KnowledgeGraphComponent();
  graph.displayGraph(1);
  console.log(graph.graph);

  expect(2).toBe(2);
});
