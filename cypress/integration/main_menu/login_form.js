/// <reference types="cypress" />
import { userBuilder } from "../../support/generate";

describe("User login, logout and registration", () => {
  let user = null;
  let polyfill;

  before(() => {
    const polyfillUrl = "https://unpkg.com/unfetch/dist/unfetch.umd.js";
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route(
      "POST",
      `${Cypress.env("BACKEND_URL")}/${Cypress.env("GRAPHQL_ID")}/`
    ).as("graphqlQuery");

    cy.visit("/", {
      onBeforeLoad(win) {
        delete win.fetch;
        win.eval(polyfill);
        win.fetch = win.unfetch;
      }
    });
    cy.wait("@graphqlQuery");
  });

  it("should open overlay with a sign in and register form", () => {
    cy.getByTestId("login-btn")
      .click()
      .get(".overlay")
      .should("exist");
  });

  describe("Registration", () => {
    it("should register a new user", () => {
      user = userBuilder();
      cy.registerUser(user);
      cy.get(".message__title").contains("New user has been created");
    });
    it("should display an error if user exists", () => {
      cy.registerUser(user)
        .get(".login__content .input")
        .first()
        .get(".input__error")
        .contains("User with this Email already exists.");
    });
  });

  describe("Login", () => {
    it("should successfully log in an user", () => {
      cy.loginUser(user)
        .get(".message__title")
        .contains("You are now logged in");
    });
    it("should display an error if user does not exist", () => {
      const notRegisteredUser = userBuilder();
      cy.loginUser(notRegisteredUser)
        .get(".login__content .form-error")
        .contains("Please, enter valid credentials");
    });
  });

  describe("Logout", () => {
    it("should successfully log out an user", () => {
      const user = userBuilder();
      cy.registerUser(user).loginUser(user);
      cy.logoutUser()
        .get(".message__title")
        .should("contain", "You are now logged out");
    });
  });
});
