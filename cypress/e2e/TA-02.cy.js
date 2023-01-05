describe("TA-02 - Open a new pdf document", () => {
  beforeEach(() => {
    cy.visit("https://pdfl-pdf-legacy.onrender.com/#");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/black bear.pdf", { force: true });

  });


  it("Pdf reader UI", () => {

    cy.get(".open-new")
      .click()
      .first()
      .selectFile("cypress/fixtures/comp.pdf", { force: true });

    cy.title().should("eq", "PDFL - PDF Legacy");

    cy.get("#pdf-container").should("exist")
      .get("#text-layer-1").should("exist")
      .get("#text-layer-2").should("exist")
      .get("#text-layer-3").should("exist")

    cy.get("#navbar").children().should("have.length", 3)
      .get("#start").should("exist")
      .get("#center").should("exist")
      .get("#end").should("exist")

    cy.get("#start")
      .get("#title").contains( "comp.pdf")
      .get("#pages-sidebar").should("exist")
      .get(".verticalToolbarSeparator").should("exist");

    cy.get("#center")
      .get("#prev-page").should("exist")
      .get("#num-pages").should("exist")
      .get("#current-page").should("exist")
      .get("#page-count").should("exist")
      .get("#next-page").should("exist")
      .get("#zoom-in").should("exist")
      .get("#zoom-level").should("exist")
      .get("#zoom-out").should("exist");

    cy.get("#end")
      .get(".open-new").should("exist")
      .get("#toggle").should("exist")
      .get(".switch").should("exist")
      .get(".slider").should("exist")
      .get("#graph-maker").should("exist")
      .get("#summary-maker").should("exist")
      .get("#full-screen").should("exist")
      .get("#question-mark-margin").should("exist");

  });


})