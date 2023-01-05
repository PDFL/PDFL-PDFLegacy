describe("TA-07 - Zoom in (out) (with PDFL tools)\n", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  })

  it("Zoom in (out) (PDFL tools)", () => {

    cy.wait(300);

    cy.get("#zoom-in")
      .click()
      .get('input[id="zoom-level"]')
      .should("have.value", "133%");

    cy.get("#zoom-out")
      .click()
      .get('input[id="zoom-level"]')
      .should("have.value", "88.%");


  })

});