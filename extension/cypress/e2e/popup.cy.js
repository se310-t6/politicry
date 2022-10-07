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

  it("enables the correct checkboxes", () => {
    cy.get("#redditSwitch").should("be.checked");
    cy.get("#instagramSwitch").should("not.be.checked");
    cy.get("#facebookSwtich").should("not.be.checked");
  });
});
