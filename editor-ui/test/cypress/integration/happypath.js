describe("Editor-UI", () => {
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

  it("everything works", () => {
    cy.visit("/#/flows");

    // Create a Flow

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

    // Create a Nugget within the Flow

    cy.dataCy("nuggets-new-nugget-form-toggle-btn").click(15, 40);

    cy.dataCy("nuggets-new-nugget-form-submit-btn").click(15, 40, {
      force: true,
    });
    cy.dataCy("nuggets-new-nugget-form-name-fld").type("My First Nugget", {
      force: true,
    });
    cy.dataCy("nuggets-new-nugget-form-title-fld").type(
      "Nugget titles are optional"
    );
    cy.dataCy("nuggets-new-nugget-form-submit-btn").click(15, 40, {
      force: true,
    });

    // Create an H2 Block within the Nugget
    cy.dataCy("new-block-btn-n0").click(15, 40, {
      force: true,
    });
    cy.dataCy("new-block-btn-n0-header").click(15, 40, {
      force: true,
    });
    cy.dataCy("new-block-btn-n0-header-h2").click(15, 40, {
      force: true,
    });
    cy.dataCy("nugget0-block0-heading-fld").type("TachyonCMS Rocks!");
    cy.dataCy("nugget0-block0-save-btn").click(15, 40, {
      force: true,
    });
    cy.dataCy("nugget0-block0-close-btn").click(15, 40, {
      force: true,
    });

    // Create an Image Block within the Nugget
    cy.dataCy("new-block-btn-n0").click(15, 40, {
      force: true,
    });
    cy.dataCy("new-block-btn-n0-images").click(15, 40, {
      force: true,
    });
    cy.dataCy("new-block-btn-n0-images-image").click(15, 40, {
      force: true,
    });
    cy.dataCy("nugget0-block0-url-fld").type("TachyonCMS Rocks!");
    cy.dataCy("nugget0-block0-save-btn").click(15, 40, {
      force: true,
    });
    cy.dataCy("nugget0-block0-close-btn").click(15, 40, {
      force: true,
    });
  });
});
