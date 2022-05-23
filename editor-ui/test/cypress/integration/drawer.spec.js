describe("Drawer", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("has expected drawer text", () => {
    cy.dataCy("expand-storage-api-login").should(
      "contain",
      "Connect to Storage API"
    );
  });
  it("provides a Storage API login", () => {
    cy.dataCy("toggle-drawer-btn").click(15, 40, { force: true });
    cy.dataCy("expand-storage-api-login").click(15, 40, { force: true });
    cy.dataCy("storage-api-login-submit").click(15, 40, { force: true });
  });
});
