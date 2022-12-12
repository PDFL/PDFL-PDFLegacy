import { compareSimilarity } from "../src/services/Utils";

const TITLE =
  "Frequncy and Density Associated Grouping Patterns of Male Roosevelt Elk";
const TITLE2 =
  "FFrequncy And density Associated  Grouping patterns of Male roosevelt Elk";

test("Tests Utils.compareSimilarity", async () => {
  expect(compareSimilarity(TITLE, TITLE2)).toBe(true);
});

test("Tests Utils.compareSimilarity, not similar enough", async () => {
  var differentTitle =
    "Frequncy and Height Associated Grouping Patterns of Black Bears";
  expect(compareSimilarity(TITLE, differentTitle)).toBe(false);
});
