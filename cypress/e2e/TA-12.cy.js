describe("TA-12 - URL\n", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  })

  it("URL", () => {

    cy.wait(300);

    cy.get("#pdfjs_internal_id_127R").click();

    cy.on("url:changed", (newUrl) => {
      expect(newUrl).to.contain("https://www.esri.com/zh-cn/arcgis/products/arcgis-desktop/resources")
    })


  })

});