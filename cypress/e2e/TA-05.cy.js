describe("TA-05 - Jump to selected page\n", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  })

  it("Jump to selected page", () => {

    cy.wait(300);

    cy.get("#current-page")
      .click()
      .type("{backspace}10{enter}")
      .get("#text-layer-10").should("be.visible");

  })

});