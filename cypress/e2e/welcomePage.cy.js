describe("PDF Legacy welcome page tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");
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

    cy.get("#s1")
      .should("exist")
      .get("#s2")
      .should("exist")
      .get("#s3")
      .should("exist")
      .get("#s4")
      .should("exist");

    cy.get("#carousel")
      .should("exist")
      .get("#s1")
      .should("exist")
      .get("#s2")
      .should("exist")
      .get("#s3")
      .should("exist")
      .get("#s4")
      .should("exist");

    cy.get("#carousel")
      .get("#slider")
      .should("exist")
      .get(".card")
      .should("exist")
      .get(".icon-welcome-page")
      .should("exist")
      .get(".text-card-welcome-page")
      .contains(
        "Read the paper with extra gear! Hover over the reference and display the corresponding subject in a popup or a side page."
      );

    cy.get("#carousel")
      .get("#slider")
      .should("exist")
      .get(".card")
      .should("exist")
      .get(".icon-welcome-page")
      .should("exist")
      .get(".text-card-welcome-page")
      .contains(
        "Improve your reading efficiency with summarization tool! You can summarize the whole paper or select the text you want to summarize."
      );

    cy.get("#carousel")
      .get("#slider")
      .should("exist")
      .get("div")
      .get(".card")
      .should("exist")
      .get(".icon-welcome-page")
      .should("exist")
      .get(".text-card-welcome-page")
      .contains(
        "Create the knowledge graph that shows the citation relations of all the papers in the references section of the paper you are reading."
      );

    cy.get("#carousel")
      .get("#slider")
      .should("exist")
      .get(".card")
      .should("exist")
      .get(".icon-welcome-page")
      .should("exist")
      .get(".text-card-welcome-page")
      .contains(
        "Keywords in research papers are phrases that define the research topic. With this tool you can highlight sentences containing paper keywords."
      );

    cy.get(".black-logo").should("exist");

    cy.get(".footer-text").should("exist");
  });
});
