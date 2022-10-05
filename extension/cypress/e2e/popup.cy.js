/// <reference types="cypress" />

describe("extension popup", () => {
  beforeEach(() => {
    cy.visit("http://localhost:1234", {
      onBeforeLoad(window) {
        // mock the chrome extension APIs
        if (!window.chrome) window.chrome = {};
        window.chrome.storage = {
          sync: {
            // .get returns true for "redditToggled", false for all others
            get: ([name], cb) => cb({ [name]: name === "redditToggled" }),
            set: () => undefined, // no-op
          },
        };
      },
    });
  });

  // Checbox tests

  it("enables the correct checkboxes", () => {
    cy.get("#redditSwitch").should("be.checked");
    cy.get("#instagramSwitch").should("not.be.checked");
  });

  // Tooltip tests
  
  it("hides tooltips by default", () => {
    cy.get(".tooltip").each(($tooltip) => {
      cy.get($tooltip).should("have.css", "visibility", "hidden");
    });
  });

  // Normal vs edit mode tests

  it("displays/hides UI components at the start", () => {
    cy.get("#tagList").should("have.css", "display", "flex");
    cy.get("#editTagsTextArea").should("have.css", "display", "none");

    cy.get("#manageTagListBtn").should("have.css", "display", "flex");
    cy.get("#editTagsActions").should("have.css", "display", "none");
  });

  it("displays/hides UI components when in edit mode", () => {
    cy.get("#manageTagListBtn").click();

    cy.get("#tagList").should("have.css", "display", "none");
    cy.get("#editTagsTextArea").should("have.css", "display", "flex");

    cy.get("#editTagsActions").should("have.css", "display", "flex");
    cy.get("#manageTagListBtn").should("have.css", "display", "none");
  });

  it("displays/hides UI components when exiting edit mode", () => {
    cy.get("#manageTagListBtn").click();
    cy.get("#cancelTagsBtn").click();

    cy.get("#tagList").should("have.css", "display", "flex");
    cy.get("#editTagsTextArea").should("have.css", "display", "none");

    cy.get("#manageTagListBtn").should("have.css", "display", "flex");
    cy.get("#editTagsActions").should("have.css", "display", "none");
  });
});
