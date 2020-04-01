import React from "react";

import { Checkbox, Radio } from "@components/atoms";

import { AddressForm, AddressGridSelector, DiscountForm } from "..";
import * as S from "./styles";
import { IProps } from "./types";

/**
 * Payment options used in checkout.
 */
const CheckoutPayment: React.FC<IProps> = ({
  selectedUserAddressId,
  userAddresses,
  billingAsShippingAddress = false,
  checkoutBillingAddress,
  countries,
  formRef,
  formId,
  paymentGateways,
  setBillingAddress,
  setBillingAsShippingAddress,
}: IProps) => {
  const adresses =
    userAddresses
      ?.filter(function notEmpty<TValue>(
        value: TValue | null | undefined
      ): value is TValue {
        return value !== null && value !== undefined;
      })
      .map(address => ({
        address: {
          ...address,
          isDefaultBillingAddress: address.isDefaultBillingAddress || false,
          isDefaultShippingAddress: address.isDefaultShippingAddress || false,
          phone: address.phone || undefined,
        },
        id: address?.id || "",
        onSelect: () => null,
      })) || [];

  return (
    <S.Wrapper>
      <S.Section>
        <S.Title>BILLING ADDRESS</S.Title>
        <Checkbox
          name="billing-same-as-shipping"
          checked={billingAsShippingAddress}
          onChange={() =>
            setBillingAsShippingAddress(!billingAsShippingAddress)
          }
        >
          Same as shipping address
        </Checkbox>
        {!billingAsShippingAddress && (
          <>
            <S.Divider />
            {userAddresses ? (
              <AddressGridSelector
                addresses={adresses}
                selectedAddressId={selectedUserAddressId}
                onSelect={setBillingAddress}
              />
            ) : (
              <AddressForm
                formId={formId}
                formRef={formRef}
                countriesOptions={countries.filter(function notEmpty<TValue>(
                  value: TValue | null | undefined
                ): value is TValue {
                  return value !== null && value !== undefined;
                })}
                address={checkoutBillingAddress || undefined}
                handleSubmit={address => address && setBillingAddress(address)}
              />
            )}
          </>
        )}
      </S.Section>
      <S.Divider />
      <S.Section>
        <S.Title>PAYMENT METHOD</S.Title>
        <Checkbox
          name="billing-same-as-shipping"
          checked={billingAsShippingAddress}
          onChange={() =>
            setBillingAsShippingAddress(!billingAsShippingAddress)
          }
        >
          Do you have a gift card voucher or discount code?
        </Checkbox>
        <S.DiscountField>
          <DiscountForm
            discount={{ promoCode: null }}
            handleApplyDiscount={() => null}
            handleRemovePromoCode={() => null}
            errors={null}
          />
        </S.DiscountField>
        <S.Divider />
        <S.PaymentMethodList>
          {paymentGateways.map(({ name, config }, index) => {
            return (
              <S.Tile checked={false} key={index}>
                <Radio
                  name="payment-method"
                  value={""}
                  checked={false}
                  customLabel={true}
                >
                  {name}
                </Radio>
              </S.Tile>
            );
          })}
        </S.PaymentMethodList>
      </S.Section>
    </S.Wrapper>
  );
};

export { CheckoutPayment };
