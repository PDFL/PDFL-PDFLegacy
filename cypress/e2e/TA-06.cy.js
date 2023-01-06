describe("TA-06 - Scrolling\n", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  })

  it("Scrolling", () => {

    cy.wait(500);

    cy.scrollTo(0, 1750)
      .get("#text-layer-3").should("be.visible");

    cy.scrollTo(1750, 5000)
      .get("#text-layer-7").should("be.visible");

    cy.scrollTo(5000, 10000)
      .get("#text-layer-13").should("be.visible");

    cy.scrollTo("bottom")
      .get("#text-layer-14").should("be.visible");

    cy.scrollTo("top")
      .get("#text-layer-1").should("be.visible");

  })

});