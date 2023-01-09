import { extractKeywords } from "../src/services/KeywordExtractionService";
import * as pdfjsLib from "pdfjs-dist/webpack";

test("Tests KeywordExtractionService.extractKeywords, paper does not contain keywords, empty array is returned", async () => {
  const noKeywordsPDF = await pdfjsLib.getDocument(
    "https://www.parkinsons.va.gov/resources/MOCA-Test-English.pdf"
  ).promise;
  const keywords = await extractKeywords(noKeywordsPDF);

  expect(keywords.length).toBe(0);
});

test("Tests KeywordExtractionService.extractKeywords, paper keywords in metadata, four keywords returned", async () => {
  const keywordsInMetadataPDF = await pdfjsLib.getDocument("https://pdfs.semanticscholar.org/70ae/78b587d23de70eeb024d708ed3981f1340ed.pdf?_ga=2.188218856.153495781.1673254961-1818577187.1671554186").promise;
  const keywords = await extractKeywords(keywordsInMetadataPDF);

  expect(keywords.length).toBe(4);
  expect(keywords[0]).toEqual("probabilistic programming");
  expect(keywords[1]).toBe("Bayesian inference");
  expect(keywords[2]).toBe("algorithmic differentiation");
  expect(keywords[3]).toBe("Stan");
});

test("Tests KeywordExtractionService.extractKeywords, parsing paper keywords from text, four keywords returned", async () => {
  const noKeywordsPDF = await pdfjsLib.getDocument("https://pdfs.semanticscholar.org/70ae/78b587d23de70eeb024d708ed3981f1340ed.pdf?_ga=2.188218856.153495781.1673254961-1818577187.1671554186").promise;

  const metadata = await noKeywordsPDF.getMetadata();
  metadata.info.Keywords = null;

  const keywords = await extractKeywords(noKeywordsPDF);

  expect(keywords.length).toBe(4);
  expect(keywords[0]).toEqual("probabilistic program");
  expect(keywords[1]).toBe("Bayesian inference");
  expect(keywords[2]).toBe("algorithmic differentiation");
  expect(keywords[3]).toBe("Stan");
});
