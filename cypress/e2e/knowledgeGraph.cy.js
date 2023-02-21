describe("Knowledge Graph functionallity (TA-14 to TA-16)", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });

    cy.wait(300);
  });

  it("TA-14: Open Knowledge Graph", () => {
    cy.get(".force-graph-container").should("not.exist");
    cy.get("#graph-maker").click();

    cy.wait(8000);

    cy.get(".force-graph-container").should("be.visible");
  });

  it("TA-15: Building the Knowledge Graph", () => {
    Cypress.config("defaultCommandTimeout", 10000);

    cy.get(".force-graph-container").should("not.exist");
    cy.get("#graph-maker").click();

    cy.intercept(/https\:\/\/api\.semanticscholar\.org\/.*\?/).as("myAlias");
    cy.wait("@myAlias").then((interception) => {
      expect(interception.request.url).to.include("semanticscholar");
    });

    cy.wait(8000);

    cy.get(".force-graph-container").find("canvas").should("exist");
  });
});
