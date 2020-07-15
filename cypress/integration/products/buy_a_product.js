import { HEADER_SELECTORS } from "../../elements/main-header/header-selectors";
import { PRODUCTS_SELECTORS } from "../../elements/products/products-selectors";
import { CHECKOUT_SELECTORS } from "../../elements/products/checkout-selectors";

describe("Buy a product as a logged user", () => {
  let polyfill;

  before(() => {
    const polyfillUrl = "https://unpkg.com/unfetch/dist/unfetch.umd.js";
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

  beforeEach(() => {
    cy.setup(polyfill);
    cy.loginUser();
  });

  it("should buy a product", () => {
    cy.get(PRODUCTS_SELECTORS.product_list)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.first_selected_product_name)
      .get(PRODUCTS_SELECTORS.variantPicker)
      .click()
      .get(PRODUCTS_SELECTORS.attributOptions)
      .first()
      .click()
      .get(PRODUCTS_SELECTORS.addToBasketBtn)
      .click()
      .get(PRODUCTS_SELECTORS.cartQuantity)
      .should("be.visible")
      .click()
      .get(PRODUCTS_SELECTORS.checkoutBtn)
      .click()
      .get(PRODUCTS_SELECTORS.procceedToCheckoutBtn)
      .click();

    cy.addNewAddress();

    const firstProductName = PRODUCTS_SELECTORS.first_selected_product_name;
  });
});
