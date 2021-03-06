describe("Editor-UI", () => {
  beforeEach(() => {
    cy.wait(3000);
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

    cy.dataCy("drawer-new-flow-form-toggle-btn").click(15, 40, { force: true });
    cy.dataCy("drawer-new-flow-form-name-fld").type("My Cool New Project", {
      force: true,
    });
    cy.dataCy("drawer-toggle-btn").click(15, 40, { force: true });
    cy.dataCy("drawer-new-flow-form-title-fld").type(
      "TachyonCMS - One CMS to rule them all",
      { force: true }
    );
    cy.dataCy("drawer-new-flow-form-notes-fld").type(
      "Install TachyonCMS TODAY!!",
      { force: true }
    );
    cy.dataCy("drawer-new-flow-form-submit-btn").click(15, 40, { force: true });

    // Create a Nugget within the Flow

    cy.dataCy("nuggets-new-nugget-form-toggle-btn").click(15, 40, {
      force: true,
    });

    cy.dataCy("nuggets-new-nugget-form-submit-btn").click(15, 40, {
      force: true,
    });
    cy.dataCy("nuggets-new-nugget-form-name-fld").type(
      "My First Nugget of Information",
      {
        force: true,
      }
    );
    cy.dataCy("nuggets-new-nugget-form-title-fld").type(
      "Nugget titles are optional",
      { force: true }
    );
    cy.dataCy("nuggets-new-nugget-form-submit-btn").click(15, 40, {
      force: true,
    });
    //=================================================
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
    cy.dataCy("nugget0-block0-heading-fld").type("TachyonCMS Rocks!", {
      force: true,
    });
    cy.dataCy("nugget0-block0-save-btn").click(15, 40, {
      force: true,
    });
    cy.dataCy("nugget0-block0-close-btn").click(15, 40, {
      force: true,
    });
    //=================================================
    // Click to create a new image block
    cy.dataCy("new-block-btn-n0").click(15, 40, {
      force: true,
    });
    // Choose images
    cy.dataCy("new-block-btn-n0-images").click(15, 40, {
      force: true,
    });
    // Choose Image
    cy.dataCy("new-block-btn-n0-images-image").click(15, 40, {
      force: true,
    });
    // Enter image URL
    cy.dataCy("nugget0-block1-url-fld").type(
      "https://raw.githubusercontent.com/TachyonCMS/tachyoncms/ededdd04d0a1f95ae782ad14f862af1f4ad31ccf/editor-ui/docs/images/TachyonCMS-High-Level-Component-View.svg"
    );
    // Enter a caption
    cy.dataCy("nugget0-block1-caption-fld").type(
      "A better way to manage content"
    );
    // Set caption position
    cy.dataCy("nugget0-block1-caption-position-select").click(15, 40, {
      force: true,
    });
    cy.contains("Bottom-right").click();
    // Set caption font
    cy.dataCy("nugget0-block1-caption-font-select").click(15, 40, {
      force: true,
    });
    cy.contains("Impact").click();
    // Set caption font size
    cy.dataCy("nugget0-block1-caption-font-size-select").click(15, 40, {
      force: true,
    });
    cy.contains("Big").click();
    // Set caption font style
    cy.dataCy("nugget0-block1-caption-font-style-select").click(15, 40, {
      force: true,
    });
    cy.contains("Italic").click();
    // Set caption font weight
    cy.dataCy("nugget0-block1-caption-font-weight-select").click(15, 40, {
      force: true,
    });
    cy.contains("Medium").click();
    // Set caption color
    cy.dataCy("nugget0-block1-caption-font-color-fld").type("#FFFF00", {
      force: true,
    });
    cy.dataCy("nugget0-block1-save-btn").click(15, 40, {
      force: true,
    });
    cy.dataCy("nugget0-block1-close-btn").click(15, 40, {
      force: true,
    });
    //=================================================
    // Click to create a new rich-text block above the image (b1)
    cy.dataCy("new-block-before-btn-n0-b1").click(15, 40, {
      force: true,
    });
    // Choose rich-text
    cy.dataCy("new-block-before-btn-n0-b1-richtext").click(15, 40, {
      force: true,
    });

    // Click on Align in toolbar
    cy.get("[class=q-editor__toolbar-group]").within(() => {
      cy.contains("Align").click();
    });
    // Click on "Center align"
    cy.contains("Center align").click();

    // Click on "Default Font"
    cy.get("[class=q-editor__toolbar-group]").within(() => {
      cy.contains("Default Font").click();
    });
    // Click on  "Arial Black"
    cy.contains("Arial Black").click();

    // Click on "Font Size"
    cy.get("[class=q-editor__toolbar-group]").within(() => {
      cy.contains("Font Size").click();
    });
    // Click on "Maximum"
    cy.contains("Very big").click();

    // Type in the contenteditable space
    cy.get("[class=q-editor__content]").type("Big things coming soon...");

    cy.dataCy("nugget0-block1-save-btn").click(15, 40, {
      force: true,
    });
    cy.dataCy("nugget0-block1-close-btn").click(15, 40, {
      force: true,
    });
    //=================================================
    cy.scrollTo("bottom");
    cy.wait(500);
    cy.scrollTo("top");
    cy.wait(500);
    cy.scrollTo("bottom");
    //=================================================
    // Preview Flow
    // Open drawer
    cy.dataCy("drawer-toggle-btn").click(15, 40, { force: true });
    // Click Preview Flow
    cy.dataCy("drawer-flow-preview-flow").click(15, 40, {
      force: true,
    });
    cy.scrollTo("top");
    cy.wait(500);
    cy.scrollTo("bottom");
    cy.wait(1000);
    cy.scrollTo("top");
  });
});
