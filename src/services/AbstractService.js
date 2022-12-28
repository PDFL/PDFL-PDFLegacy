import { fetchPaperInfo, fetchPaperAbstract } from "./Api";
import { compareSimilarity } from "./Utils";

/**
 * @async
 * Fetch Abstract from semantic scholar
 * @param pdfDoc PDF Document to search for
 * @returns {Promise<string|null>} string containing the abstract or null
 */
async function getPaperAbstract(pdfDoc) {
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
  let abstract = await fetchPaperAbstract(currentPaperInfo.paperId);
  if (!abstract || abstract === "") {
    return null;
  }
  return abstract;
}

export { getPaperAbstract };
