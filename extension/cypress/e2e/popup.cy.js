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
            get: (_, cb) => {
              const data = {
                redditToggled: true,
                twitterToggled: false,
                blockedWords: ["train", "metro", "bus"],
              };
              return cb?.(data) || new Promise((cb) => cb(data));
            },
            set: () => undefined, // no-op
          },
        };
        window.chrome.tabs = {
          query: async () => [{ url: "https://example.com" }],
        };

        // override window.open so that we can assert if it's called without a new tab opening
        cy.stub(window, "open").as("openNewTab");
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

  it("opens the correct help URL", () => {
    cy.get("a#report-link").click();

    const data =
      "eyJyZWRkaXRUb2dnbGVkIjp0cnVlLCJ0d2l0dGVyVG9nZ2xlZCI6ZmFsc2UsImJsb2NrZWRXb3JkcyI6WyJ0cmFpbiIsIm1ldHJvIiwiYnVzIl0sImN1cnJlbnRVcmwiOiJodHRwczovL2V4YW1wbGUuY29tIn0=";
    cy.get("@openNewTab").should(
      "be.calledWith",
      "https://politicry.com/report#" + data,
      "_blank",
      "noopener",
    );

    expect(JSON.parse(atob(data))).to.deep.equal({
      redditToggled: true,
      twitterToggled: false,
      blockedWords: ["train", "metro", "bus"],
      currentUrl: "https://example.com",
    });
  });
});
