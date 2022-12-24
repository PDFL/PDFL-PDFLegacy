describe("PDF Legacy e2e tests", () => {
  beforeEach(() => {
    cy.visit("localhost:8080");
  });

  it("check welcome page", () => {
    cy.title().should("eq", "PDFL - PDF Legacy");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });
  });
});
