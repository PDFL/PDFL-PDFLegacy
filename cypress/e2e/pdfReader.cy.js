describe("PDF Legacy pdf reader basic tests", () => {
  beforeEach(() => {
    cy.visit("localhost:8080");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  });

  it("Pdf reader UI", () => {
    cy.title().should("eq", "PDFL - PDF Legacy");
    cy.get("#navbar").children().should("have.length", 3);
  });
});
