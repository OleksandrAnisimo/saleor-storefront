import faker from "faker";

import { HEADER_SELECTORS } from "../../elements/main-header/header-selectors";
import { LOGIN_SELECTORS } from "../../elements/saleor-account/login-selectors";

describe("User login, logout and registration", () => {
  let polyfill = null;

  before(() => {
    const polyfillUrl = "https://unpkg.com/unfetch/dist/unfetch.umd.js";
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

  beforeEach(() => {
    cy.server();
    cy.route("POST", `${Cypress.env("API_URI")}`).as("graphqlQuery");

    cy.visit("/", {
      onBeforeLoad(win) {
        delete win.fetch;
        // since the application code does not ship with a polyfill
        // load a polyfilled "fetch" from the test
        win.eval(polyfill);
        win.fetch = win.unfetch;
      },
    });
  });

  it("should open overlay with a sign in and register form", () => {
    cy.get(HEADER_SELECTORS.mainMenuButton)
      .click()
      .get(".overlay")
      .should("exist");
  });

  describe("Register new account", () => {
    it("should register a new user", () => {
      const randomWord = faker.random.words(2).replace(" ", "-");
      const fakeEmailAdressText = `${randomWord}@example.com`;
      const fakePasswordText = faker.internet.password();

      cy.get(HEADER_SELECTORS.mainMenuButton)
        .click()
        .get(LOGIN_SELECTORS.registerNewAccount)
        .click()
        .get(LOGIN_SELECTORS.emailAddressInput)
        .type(fakeEmailAdressText)
        .get(LOGIN_SELECTORS.emailPasswordInput)
        .type(fakePasswordText)
        .get(LOGIN_SELECTORS.registerButton)
        .click()
        .get(LOGIN_SELECTORS.registrationConfirmationWarning)
        .should("contain", "New user has been created");
    });
  });

  describe("Login", () => {
    it("should successfully log in an user", () => {
      cy.loginUser()
        .get(LOGIN_SELECTORS.alertPopupMessage)
        .should("contain", "You are now logged in");
    });

    it("should display an error if user does not exist", () => {
      cy.get(HEADER_SELECTORS.mainMenuButton)
        .click()
        .get(LOGIN_SELECTORS.emailAddressInput)
        .type("thisUserIsNotRegistered@example.com")
        .get(LOGIN_SELECTORS.emailPasswordInput)
        .type("thisisnotavalidpassword")
        .get(LOGIN_SELECTORS.signInButton)
        .click()
        .get(LOGIN_SELECTORS.warningCredentialMessage)
        .should("contain", "Please, enter valid credentials");
    });
  });

  describe("Logout", () => {
    it("should successfully log out an user", () => {
      cy.loginUser()
        .wait(2000)
        .logoutUser()
        .get(LOGIN_SELECTORS.alertPopupMessage)
        .should("contain", "You are now logged out");
    });
  });
});
