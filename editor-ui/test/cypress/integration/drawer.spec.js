describe("Drawer", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("drawer-storage-api-login-toggle-btn").should(
      "contain",
      "Connect to Storage API"
    );
    cy.dataCy("drawer-toggle-btn").click(15, 40, { force: true });
    cy.dataCy("drawer-storage-api-login-toggle-btn").click(15, 40, {
      force: true,
    });
    cy.dataCy("drawer-storage-api-login-submit-btn").click(15, 40, {
      force: true,
    });
  });

  it("supports creating a new Flow", () => {
    cy.visit("/#/flows");

    cy.dataCy("drawer-new-flow-form-toggle-btn").click(15, 40);
    cy.dataCy("drawer-new-flow-form-name-fld").type("My Cool New Project", {
      force: true,
    });
    cy.dataCy("drawer-toggle-btn").click(15, 40, { force: true });
    cy.dataCy("drawer-new-flow-form-title-fld").type(
      "TachyonCMS - One CMS to rule them all"
    );
    cy.dataCy("drawer-new-flow-form-notes-fld").type(
      "Install TachyonCMS TODAY!!"
    );

    cy.dataCy("drawer-new-flow-form-submit-btn").click(15, 40, { force: true });
  });
});
