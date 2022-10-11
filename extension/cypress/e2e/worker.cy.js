/// <reference types="cypress" />

describe("extension worker", () => {
  beforeEach(() => {
    cy.visit("http://localhost:1234/worker-test.html");
  });

  describe("instagram", () => {
    it("blurs the correct images", () => {
      cy.get("#instagram > img[alt=Pizza]").should(
        "have.css",
        "filter",
        "blur(30px)",
      );

      cy.get("#instagram > img[alt=Sushi]").should(
        "not.have.css",
        "filter",
        "blur(30px)",
      );
    });

    it("blurs the correct posts", () => {
      cy.get("#instagram > ul > img")
        .first()
        .should("have.css", "filter", "blur(30px)");

      cy.get("#instagram > ul > img")
        .last()
        .should("not.have.css", "filter", "blur(30px)");
    });
  });

  describe("twitter", () => {
    it("blurs the correct tweets", () => {
      cy.get("#twitter div[lang='en']")
        .first()
        .should("have.css", "filter", "blur(4px)");

      cy.get("#twitter div[lang='en']")
        .last()
        .should("not.have.css", "filter", "blur(4px)");
    });
  });

  describe("reddit", () => {
    it("blurs the correct posts", () => {
      cy.get("#reddit .scrollerItem")
        .first()
        .should("have.css", "filter", "blur(5px)");

      cy.get("#reddit .scrollerItem")
        .last()
        .should("not.have.css", "filter", "blur(5px)");
    });
  });

  describe("allowed", () => {
    it("does not blur posts with allowed words", () => {
      cy.get("#allowed div[lang='en']")
        .first()
        .should("not.have.css", "filter", "blur(4px)");

      cy.get("#allowed div[lang='en']")
        .last()
        .should("not.have.css", "filter", "blur(4px)");
    });
  });
});
