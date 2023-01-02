import { PdfReaderComponent } from "../src/components/PdfReaderComponent";

/**
 * Setup function for tests that require actual DOM of the app.
 * Sets the html of the document as the actual index.html file
 * the app uses.
 */
function setupDom() {
  const fs = require("fs");
  const path = require("path");
  const html = fs.readFileSync(
    path.resolve(__dirname, "../src/templates/index.html"),
    "utf8"
  );

  document.documentElement.innerHTML = html.toString();
}

/**
 * Helper sleep function to await function that start asynchronus tasks.
 *
 * @async
 * @param {int} ms
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Before each hook which will set the DOM of the app.
 */
beforeEach(() => {
  setupDom();
});

jest.setTimeout(30000);

test("Reader initialization with a pdf", async () => {
  let reader = new PdfReaderComponent();

  expect(reader.pdfDoc == undefined).toBe(true);
  expect(reader.components.loader.className.includes("hidden")).toBe(false);

  reader.loadPdf("http://www.pdf995.com/samples/pdf.pdf");

  await sleep(4000);

  expect(reader.pdfDoc == undefined).toBe(false);
  expect(reader.components.loader.className.includes("hidden")).toBe(true);
});
