import { FIELD_OF_STUDY_COLOR } from "../src/Constants";
import { fetchPaperInfo } from "../src/services/Api";
import {
  fieldsOfStudyToColor,
  getCitations,
  getReferences,
} from "../src/services/KnowledgeGraphService";

const TITLE =
  "Frequency and Density Associated Grouping Patterns of Male Roosevelt Elk";
const PAPER_ID = "e21c794b4941a5628b3b8c138e211a5b75b66a08";
const EXPECTED_FIELDS_OF_STUDY = ["Biology"];
// This paper has this paper_id, 1 citation and 74 references

test("Tests KnowledgeGraphService.getPaperID", async () => {
  let paperInfo = await fetchPaperInfo(TITLE);

  expect(paperInfo.title).toBe(TITLE);
  expect(paperInfo.paperId).toBe(PAPER_ID);
  expect(paperInfo.fieldsOfStudy.sort()).toEqual(
    EXPECTED_FIELDS_OF_STUDY.sort()
  );
});

test("Tests KnowledgeGraphService.getPaperID, title does not exist", async () => {
  let title = "Meow meow meow meow moew";
  let paperInfo = await fetchPaperInfo(title);

  expect(paperInfo).not.toBe(title);
  expect(paperInfo.paperId.length).toBe(PAPER_ID.length);
});

test("Tests KnowledgeGraphService.getCitations", async () => {
  let citations = await getCitations(PAPER_ID);

  expect(citations.length).toBe(1);
  expect(citations[0].fieldsOfStudy.sort()).toEqual(
    EXPECTED_FIELDS_OF_STUDY.sort()
  );
});

test("Tests KnowledgeGraphService.getReferences", async () => {
  let references = await getReferences(PAPER_ID);

  expect(references.length).toBe(74);
});

test("Tests KnowledgeGraphService.fieldsOfStudyToColor", () => {
  let FIELDS_OF_STUDY = ["Medicine", "Business", "Mathematics"];
  let EXPECTED_COLOR = "rgba(110, 163, 42.666666666666664, 0.8000000000000002)";

  expect(fieldsOfStudyToColor(FIELDS_OF_STUDY)).toBe(EXPECTED_COLOR);
});

test("Tests KnowledgeGraphService.fieldsOfStudyToColor one color", () => {
  let FIELDS_OF_STUDY = ["Medicine"];

  expect(fieldsOfStudyToColor(FIELDS_OF_STUDY)).toBe(
    FIELD_OF_STUDY_COLOR[FIELDS_OF_STUDY[0]]
  );
});

test("Tests KnowledgeGraphService.fieldsOfStudyToColor no colors", () => {
  let FIELDS_OF_STUDY = [];

  expect(fieldsOfStudyToColor(FIELDS_OF_STUDY)).toBe(
    FIELD_OF_STUDY_COLOR["Missing Color"]
  );
});
