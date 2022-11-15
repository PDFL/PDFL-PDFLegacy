import {
  getCitations,
  getReferences,
  getPaperInfo,
} from "../src/services/KnowledgeGraphService";

const TITLE =
  "Frequncy and Density Associated Grouping Patterns of Male Roosevelt Elk";
const PAPER_ID = "e21c794b4941a5628b3b8c138ee211a5b75b66a08";
// This paper has this paper_id, 1 citation and 74 references

test("Tests KnowledgeGraphService.getPaperID", async () => {
  let paperInfo = await getPaperInfo(TITLE);

  expect(paperInfo.title).toBe(TITLE);
  expect(paperInfo.paperId).toBe(PAPER_ID);
});

test("Tests KnowledgeGraphService.getPaperID, title does not exist", async () => {
  let title = "Meow meow meow meow moew";
  let paperInfo = await getPaperInfo(title);

  expect(paperInfo).not.toBe(title);
  expect(paperInfo.paperId.length).toBe(PAPER_ID.length);
});

test("Tests KnowledgeGraphService.getCitations", async () => {
  let citations = await getCitations(PAPER_ID);

  expect(citations.length).toBe(1);
});

test("Tests KnowledgeGraphService.getReferences", async () => {
  let references = await getReferences(PAPER_ID);

  expect(references.length).toBe(74);
});