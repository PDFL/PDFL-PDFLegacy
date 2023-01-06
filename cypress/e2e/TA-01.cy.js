describe("TA-01 - PDF Upload", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  });


  it("Pdf reader UI", () => {
    cy.title().should("eq", "PDFL - PDF Legacy");

    cy.get("#pdf-container").should("exist")
      .get("#canvas-1").should("exist")
      .get("#canvas-2").should("exist")
      .get("#canvas-3").should("exist")
      .get("#canvas-4").should("exist")
      .get("#canvas-5").should("exist")
      .get("#canvas-6").should("exist")
      .get("#canvas-7").should("exist")
      .get("#canvas-8").should("exist")
      .get("#canvas-9").should("exist")
      .get("#canvas-10").should("exist")
      .get("#canvas-11").should("exist")
      .get("#canvas-12").should("exist")
      .get("#canvas-13").should("exist")
      .get("#canvas-14").should("exist");

  });
});
