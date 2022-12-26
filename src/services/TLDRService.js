import { fetchPaperInfo, fetchPaperTLDR } from "./Api";
import { compareSimilarity } from "./Utils";

/**
 * @async
 * Fetch TLDR from semantic scholar
 * @param pdfDoc PDF Document to search for
 * @returns {Promise<string|null>} string containing the tldr or null
 */
async function getPaperTLDR(pdfDoc) {
  let metadata = await pdfDoc.getMetadata();
  let title = metadata.info.Title;
  if (!title) {
    console.warn("Title not in metadata!");
    return null;
  }

  let currentPaperInfo = await fetchPaperInfo(title);
  if (!currentPaperInfo || !compareSimilarity(currentPaperInfo.title, title)) {
    console.warn("Titles do not match!");
    // TODO: parse references from pdf text
    return null;
  }
  console.log(currentPaperInfo);
  let tldr = await fetchPaperTLDR(currentPaperInfo.paperId);
  if (!tldr.text) {
    return null;
  }
  return tldr.text;
}

export { getPaperTLDR };
