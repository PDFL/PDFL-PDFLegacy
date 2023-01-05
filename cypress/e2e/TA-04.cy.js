describe("TA-04 - Next/Previous page (using keyboard shortcut)\n", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  })

  it("Next/Previous page(keyboard shortcut", () => {

    cy.wait(300);

    cy.get("body").type("{rightarrow}")
      .get("#text-layer-2").should("be.visible");

    cy.wait(300);

    cy.get("body").type("{leftarrow}")
      .get("#text-layer-1").should("be.visible");

  })

  });