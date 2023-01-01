describe("PDF Legacy welcoma page tests", () => {
  beforeEach(() => {
    cy.visit("localhost:8080");
  });

  it("Welcome screen", () => {
    cy.title().should("eq", "PDFL - PDF Legacy");

    cy.contains("About Us").should("exist");
    cy.contains("Select a file or drag here").should("exist");
  });
});
