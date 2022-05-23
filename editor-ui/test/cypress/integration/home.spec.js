describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("has the project name in the title", () => {
    cy.title().should("include", "TachyonCMS");
  });
});
