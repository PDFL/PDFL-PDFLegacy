describe("Cross-references (TA-17 to TA-19)", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");

    cy.get("input[type=file]")
      .first()
      .selectFile("cypress/fixtures/SE2_DD.pdf", { force: true });

    cy.wait(300);
  });

  it("TA-17: Availability Cross-References", () => {
    cy.get("#pdfjs_internal_id_679R").trigger("mouseover");
    cy.get("#pop-up").should("be.visible");
  });

  it("TA-18: Open Cross-References", function () {
    cy.get("#pdfjs_internal_id_679R").trigger("mouseover");
    cy.get("#pop-up").click();
    cy.get("#text-layer-reference").should("be.visible");
    cy.get("#reference-close-btn").should("be.visible");
  });

  it("TA-19: Open Cross-References (images, tables, chapter …)", function () {
    cy.get("#pdfjs_internal_id_725R").trigger("mouseover");
    cy.get("#pop-up-title").should("have.text", "3.2 Administrator interfaces");
    cy.get("#pop-up-text").should(
      "have.text",
      "Figure 29: Administrator Login"
    );

    cy.get("#current-page").click().type("{backspace}9{enter}");

    cy.get("#pdfjs_internal_id_222R").trigger("mouseover");
    cy.get("#pop-up-image").should("be.visible");

    cy.get("#side-page-reference-btn").click();
    cy.get("#reference-canvas").should("be.visible");
    cy.get("#reference-close-btn").should("be.visible");
  });
});
