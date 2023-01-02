import { compareSimilarity, mergeColors } from "../src/services/Utils";

const TITLE =
  "Frequncy and Density Associated Grouping Patterns of Male Roosevelt Elk";
const TITLE2 =
  "FFrequncy And density Associated  Grouping patterns of Male roosevelt Elk";

test("Tests compareSimilarity", async () => {
  expect(compareSimilarity(TITLE, TITLE2)).toBe(true);
});

test("Tests compareSimilarity, not similar enough", async () => {
  var differentTitle =
    "Frequncy and Height Associated Grouping Patterns of Black Bears";
  expect(compareSimilarity(TITLE, differentTitle)).toBe(false);
});

test("Tests mergeColors", () => {
  let colors = [
    "rgba(200, 100, 0, 1)",
    "rgba(200, 200, 0, 0.5)",
    "rgba(200, 150, 60, 0)",
  ];
  let expectedColor = "rgba(200, 150, 20, 0.5)";
  let color = mergeColors(colors);
  expect(color).toEqual(expectedColor);
});
