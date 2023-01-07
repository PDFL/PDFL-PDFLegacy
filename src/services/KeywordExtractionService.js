/**
 * Extracts keywords of given PDF document. Keywords are
 * extracted from metadata of the PDF or, if they are not
 * found there, they are extracted from 'Keywords' section
 * in text of PDF document. If no keywords are found, empty
 * array is returned.
 * @async
 * @param {PDFDocumentProxy} pdfDoc PDF document
 * @returns {String[]} keywords array
 */
async function extractKeywords(pdfDoc) {
  let keywords = await getKeywordsFromMetadata(pdfDoc);

  if (!keywords) keywords = await getKeywordsFromText(pdfDoc);

  console.log(keywords); //TODO: remove

  return keywords;
}

/**
 * Extracts keywords from metadata of given PDF document.
 * If keywords are not in the PDF document undefined returned.
 * @async
 * @param {PDFDocumentProxy} pdfDoc PDF document
 * @returns {String[]} keywords array
 */
async function getKeywordsFromMetadata(pdfDoc) {
  const metadata = await pdfDoc.getMetadata();
  
  if (metadata.info.Keywords) return metadata.info.Keywords.split(", ");

  console.warn("Keywords not in metdata!");
}

/**
 * Extracts keywords from 'Keywords' section in text of PDF document.
 * If no keywords are found, empty array is returned.
 * @async
 * @param {PDFDocumentProxy} pdfDoc PDF document
 * @returns {String[]} keywords array
 */
async function getKeywordsFromText(pdfDoc) {
  const parsedKeywords = await parseKeywordsFromText(pdfDoc);
  let keywords = new Array();

  if (parsedKeywords) {
    parsedKeywords.filter((parsed) => parsed.includes(","))
        .forEach((parsed) => {
            parsed.split(",")
                .filter((keyword) => keyword.trim() != "")
                .forEach((keyword) => keywords.push(keyword.trim()));
        });

    keywords = keywords.concat(parsedKeywords.filter((parsed) => !parsed.includes(",")));
  }

  return keywords;
}

/**
 * Searches for text containing keywords in the text of PDF
 * document. If there is no 'Keywords' section in text, 
 * undefined returned, otherwise returns array of strings
 * where each string can contain more than one keyword.
 * @async
 * @param {PDFDocumentProxy} pdfDoc PDF document
 * @returns {String[]} array of strings containing keywords
 */
async function parseKeywordsFromText(pdfDoc) {
  const text = await (await pdfDoc.getPage(1)).getTextContent();
  const items = [...text.items];

  const keywordsIndex = items.findIndex(
    (item) => item.str.trim().toUpperCase() == "KEYWORDS"
  );

  if (items[keywordsIndex + 1].str.trim() == ":")
    return extractWordItems(items.slice(keywordsIndex + 2));
}

/**
 * Filters out all text items that are not empty strings in
 * given items array untill it encounters a period character 
 * in items array. Filtered items are returned as a array of
 * strings.
 * @param {Array.<Object>} items text items containing text as
 * a string in 'str' field of item
 * @returns {String[]} array of filtered strings
 */
function extractWordItems(items) {
  const words = new Array();
  for (let item of items) {
    item = item.str.trim();
    if (item == ".") break;
    if (item != "") words.push(item);
  }
  return words;
}

export { extractKeywords };
