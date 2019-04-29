import "./scss/index.scss";

import * as React from "react";

import { Button, Form, SelectField, TextField } from "..";
import { ShopContext } from "../ShopProvider/context";
import { FormAddressType, IShippingAddressFormProps } from "./types";
import { getFormData } from "./utils";

const ShippingAddressForm: React.SFC<IShippingAddressFormProps> = ({
  data,
  billing,
  buttonText,
  errors,
  loading,
  onSubmit,
  children,
  shippingAsBilling = false
}) => (
  <div className="address-form">
    <ShopContext.Consumer>
      {({ countries, geolocalization, defaultCountry }) => (
        <Form<FormAddressType>
          errors={errors}
          onSubmit={(evt, data) => {
            evt.preventDefault();
            onSubmit(data);
          }}
          data={getFormData(geolocalization, defaultCountry, data)}
        >
          {children}
          <fieldset disabled={shippingAsBilling}>
            <div className="address-form__grid">
              <TextField
                label="First Name"
                type="given-name"
                name="firstName"
                autoComplete="given-name"
                required
              />
              <TextField
                label="Last Name"
                type="family-name"
                name="lastName"
                autoComplete="family-name"
                required
              />
            </div>
            <div className="address-form__grid">
              <TextField
                label="Street Name"
                type="address-line1"
                name="streetAddress1"
                autoComplete="address-line1"
                required
              />
              <TextField
                label="Company name (optional)"
                type="organization"
                name="companyName"
                autoComplete="organization"
              />
            </div>
            <div className="address-form__grid address-form__grid--uneven">
              <TextField
                label="ZIP Code"
                type="postal-code"
                name="postalCode"
                autoComplete="postal-code"
                required
              />
              <TextField
                label="City"
                type="city"
                name="city"
                autoComplete="address-level2"
                required
              />
            </div>
            <div className="address-form__grid">
              <TextField
                label="State/Province"
                type="state"
                name="countryArea"
                autoComplete="address-level1"
              />
              <SelectField
                label="Country"
                name="country"
                options={countries.map(country => ({
                  label: country.country,
                  value: country.code
                }))}
              />
            </div>
            <div
              className={`address-form__grid address-form__grid--${billing &&
                "full"}`}
            >
              {!billing && (
                <TextField
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  name="email"
                  required
                />
              )}

              <TextField
                label="Phone number"
                type="tel"
                name="phone"
                autoComplete="phone"
              />
            </div>
          </fieldset>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading" : buttonText}
          </Button>
        </Form>
      )}
    </ShopContext.Consumer>
  </div>
);

export default ShippingAddressForm;
