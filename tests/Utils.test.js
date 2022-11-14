import { compareSimilarity } from "../src/services/Utils";

const TITLE =
  "Frequncy and Density Associated Grouping Patterns of Male Roosevelt Elk";
const TITLE2 =
  "FFrequncy And density Associated  Grouping patterns of Male roosevelt Elk";

test("Tests KnowledgeGraphService.getPaperID", async () => {
  expect(compareSimilarity(TITLE, TITLE2)).toBe(5);
});
