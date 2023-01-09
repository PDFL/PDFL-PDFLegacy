describe("PDF Legacy welcome page tests", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");
  });

  it("Welcome screen", () => {
    cy.title().should("eq", "PDFL - PDF Legacy");
    cy.contains("About Us").should("exist");
    cy.contains("Select a file or drag here").should("exist");
    cy.contains("PDF").should("exist");
    cy.contains("Legacy").should("exist");
    cy.contains("YOUR PAPER,").should("exist");
    cy.contains("BUT").should("exist");
    cy.contains("BETTER").should("exist");

    cy.get("#s1").should("exist")
      .get("#s2").should("exist")
      .get("#s3").should("exist")
      .get("#s4").should("exist");

    cy.get("#carousel").should("exist")
      .get("#s1").should("exist")
      .get("#s2").should("exist")
      .get("#s3").should("exist")
      .get("#s4").should("exist");

    cy.get("#carousel").get("#slider").should("exist")
      .get(".card").should("exist")
      .get('.icon-welcome-page').should("exist")
      .get(".text-card-welcome-page")
      .contains("Read the paper with an extra gear. " +
      "Hover the references and extract data from them. " +
      "You can also have two pages open, " +
      "so you can view the contents of the reference at the same time");

    cy.get("#carousel").get("#slider").should("exist")
      .get(".card").should("exist")
      .get('.icon-welcome-page').should("exist")
      .get(".text-card-welcome-page")
      .contains("A text wall? Summarize your paper for each key component in a few lines! " +
        "You can also select just a piece of text with the mouse");

    cy.get("#carousel").get("#slider").should("exist").get("div")
      .get(".card").should("exist")
      .get('.icon-welcome-page').should("exist")
      .get(".text-card-welcome-page")
      .contains("Discover the knowledge graph that showing the citation " +
        "relations of all the papers in the references section of your current paper." +
        " This can help to understand the relations between each work better.");

    cy.get("#carousel").get("#slider").should("exist")
      .get(".card").should("exist")
      .get('.icon-welcome-page').should("exist")
      .get(".text-card-welcome-page")
      .contains("A paper can involve using many typical phrases/sentences for introduction, " +
        "background description and experiment result analyses. " +
        "We identifying and highlighting these sentences");

    cy.get(".black-logo").should("exist");

    cy.get(".footer-text").should("exist");

  });
})