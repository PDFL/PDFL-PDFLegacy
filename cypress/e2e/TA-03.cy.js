describe("TA-03 - Next/Previous page (using PDFL tools)\n", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });

  });

  it("Next/Previous page", () => {

    cy.get("#next-page")
      .click()
      .get("#text-layer-2").should("be.visible");

    cy.get("#prev-page")
      .click()
      .get("#text-layer-1").should("be.visible");

  })
})