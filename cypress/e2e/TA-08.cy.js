describe("TA-08 - Zoom in (out) (with keyboard shortcuts)\n", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  })

  it("Zoom in (out) (keyboard shortcuts)", () => {

    cy.wait(300);

    cy.get("body")
      .type("{ctrl} +")
      .get('input[id="zoom-level"]')
      .should("have.value", "133%");



    cy.get("body")
      .type("{ctrl} -")
      .get('input[id="zoom-level"]')
      .should("have.value", "88.%");


  })

});