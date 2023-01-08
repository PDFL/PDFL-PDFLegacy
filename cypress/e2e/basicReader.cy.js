describe("Basic reader functionallity (TA-1 to TA-13)", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });

    cy.wait(300);

  });

  it("TA-01: PDF Uploading", () => {
    cy.title().should("eq", "PDFL - PDF Legacy");

    cy.get("#pdf-container")
      .should("exist")
      .get("#canvas-1")
      .should("exist")
      .get("#canvas-2")
      .should("exist")
      .get("#canvas-3")
      .should("exist")
      .get("#canvas-4")
      .should("exist")
      .get("#canvas-5")
      .should("exist")
      .get("#canvas-6")
      .should("exist")
      .get("#canvas-7")
      .should("exist")
      .get("#canvas-8")
      .should("exist")
      .get("#canvas-9")
      .should("exist")
      .get("#canvas-10")
      .should("exist")
      .get("#canvas-11")
      .should("exist")
      .get("#canvas-12")
      .should("exist")
      .get("#canvas-13")
      .should("exist")
      .get("#canvas-14")
      .should("exist");
  });

  it("TA-02: Open a new pdf document", () => {
    cy.get("#open-new-pdf")
      .first()
      .selectFile("cypress/fixtures/comp.pdf", { force: true });

    cy.title().should("eq", "PDFL - PDF Legacy");

    cy.get("#pdf-container")
      .should("exist")
      .get("#text-layer-1")
      .should("exist")
      .get("#text-layer-2")
      .should("exist")
      .get("#text-layer-3")
      .should("exist");

    cy.get("#navbar")
      .children()
      .should("have.length", 3)
      .get("#start")
      .should("exist")
      .get("#center")
      .should("exist")
      .get("#end")
      .should("exist");

    cy.get("#start")
      .get("#title")
      .contains("comp.pdf")
      .get("#pages-sidebar")
      .should("exist")
      .get(".verticalToolbarSeparator")
      .should("exist");

    cy.get("#center")
      .get("#prev-page")
      .should("exist")
      .get("#num-pages")
      .should("exist")
      .get("#current-page")
      .should("exist")
      .get("#page-count")
      .should("exist")
      .get("#next-page")
      .should("exist")
      .get("#zoom-in")
      .should("exist")
      .get("#zoom-level")
      .should("exist")
      .get("#zoom-out")
      .should("exist");

    cy.get("#end")
      .get(".open-new")
      .should("exist")
      .get("#toggle")
      .should("exist")
      .get(".switch")
      .should("exist")
      .get(".slider")
      .should("exist")
      .get("#graph-maker")
      .should("exist")
      .get("#summary-maker")
      .should("exist")
      .get("#full-screen")
      .should("exist")
      .get("#question-mark-margin")
      .should("exist");
  });

  it("TA-03: Next/Previous page (using PDFL tools)", () => {
    cy.get("#next-page").click().get("#text-layer-2").should("be.visible");

    cy.get("#prev-page").click().get("#text-layer-1").should("be.visible");
  });

  it("TA-04: Next/Previous page (using keyboard shortcut)", () => {
    cy.get("body")
      .type("{rightarrow}")
      .get("#text-layer-2")
      .should("be.visible");

    cy.get("body")
      .type("{leftarrow}")
      .get("#text-layer-1")
      .should("be.visible");
  });

  it("TA-05: Jump to selected page", () => {
    cy.get("#current-page")
      .click()
      .type("{backspace}10{enter}")
      .get("#text-layer-10")
      .should("be.visible");
  });

  it("TA-06: Scrolling", () => {
    cy.scrollTo("bottom");

    cy.get("#text-layer-14").should("be.visible");
  });

  it("TA-07: Zoom in (out) (with PDFL tools)", () => {
    cy.get("#zoom-in")
      .click()
      .get('input[id="zoom-level"]')
      .should("have.value", "133%");

    cy.get("#zoom-out")
      .click()
      .get('input[id="zoom-level"]')
      .should("have.value", "100%");

    cy.get("#zoom-out")
      .click()
      .get('input[id="zoom-level"]')
      .should("have.value", "75%");

  });

  it("TA-08: Zoom in (out) (with keyboard shortcuts)", () => {
    cy.get("body")
      .type("{ctrl} +")
      .get('input[id="zoom-level"]')
      .should("have.value", "133%");

    cy.get("body")
      .type("{ctrl} -")
      .get('input[id="zoom-level"]')
      .should("have.value", "100%");

    cy.get("body")
      .type("{ctrl} -")
      .get('input[id="zoom-level"]')
      .should("have.value", "75%");
  });

  it("TA-10: Visualize Document", () => {
    cy.title().should("eq", "PDFL - PDF Legacy");

    cy.get("#pdf-container")
      .should("exist")
      .get("#text-layer-1")
      .should("exist")
      .get("#text-layer-2")
      .should("exist")
      .get("#text-layer-3")
      .should("exist");

    cy.get("#navbar")
      .children()
      .should("have.length", 3)
      .get("#start")
      .should("exist")
      .get("#center")
      .should("exist")
      .get("#end")
      .should("exist");

    cy.get("#start")
      .get("#title")
      .contains("black bear.pdf")
      .get("#pages-sidebar")
      .should("exist")
      .get(".verticalToolbarSeparator")
      .should("exist");

    cy.get("#center")
      .get("#prev-page")
      .should("exist")
      .get("#num-pages")
      .should("exist")
      .get("#current-page")
      .should("exist")
      .get("#page-count")
      .should("exist")
      .get("#next-page")
      .should("exist")
      .get("#zoom-in")
      .should("exist")
      .get("#zoom-level")
      .should("exist")
      .get("#zoom-out")
      .should("exist");

    cy.get("#end")
      .get(".open-new")
      .should("exist")
      .get("#toggle")
      .should("exist")
      .get(".switch")
      .should("exist")
      .get(".slider")
      .should("exist")
      .get("#graph-maker")
      .should("exist")
      .get("#summary-maker")
      .should("exist")
      .get("#full-screen")
      .should("exist")
      .get("#question-mark-margin")
      .should("exist");
  });

  it("TA-12: URL", () => {
    cy.get("#pdfjs_internal_id_127R").click();

    cy.on("url:changed", (newUrl) => {
      expect(newUrl).to.contain(
        "https://www.esri.com/zh-cn/arcgis/products/arcgis-desktop/resources"
      );
    });
  });
});
