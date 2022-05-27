describe("Drawer", () => {
  beforeEach(() => {
    //cy.visit("/");
  });
  it("has expected drawer text", () => {
    cy.visit("/");
    cy.dataCy("drawer-storage-api-login-toggle-btn").should(
      "contain",
      "Connect to Storage API"
    );
  });
  it("provides a Storage API login", () => {
    cy.dataCy("drawer-toggle-btn").click(15, 40, { force: true });
    cy.dataCy("drawer-storage-api-login-toggle-btn").click(15, 40);
    cy.dataCy("drawer-storage-api-login-submit-btn").click(15, 40, {
      force: true,
    });
  });
});
