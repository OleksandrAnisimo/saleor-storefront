import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";

import { AdyenPaymentGateway } from ".";
import { adyenPaymentMethods } from "./fixtures";

const PROPS = {
  scriptSrc:
    "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.9.5/adyen.js",
  styleSrc:
    "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.9.5/adyen.css",
  config: [
    {
      field: "origin_key",
      value: "FAKE_ORIGIN_KEY",
    },
    {
      field: "config",
      value: JSON.stringify(adyenPaymentMethods.paymentMethods),
    },
  ],
};
const processPayment = action("processPayment");
const onError = action("onError");

storiesOf("@components/organisms/AdyenPaymentGateway", module)
  .addParameters({ component: AdyenPaymentGateway })
  .add("default", () => (
    <AdyenPaymentGateway
      {...PROPS}
      processPayment={processPayment}
      onError={onError}
    />
  ));
