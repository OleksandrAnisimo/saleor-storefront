import React, { useEffect, useRef, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";

import { Button, Loader } from "@components/atoms";
import { CheckoutProgressBar } from "@components/molecules";
import { CartSummary } from "@components/organisms";
import { Checkout } from "@components/templates";
import { useCheckoutStepState } from "@hooks";
import { IItems } from "@sdk/api/Cart/types";
import { useCart, useCheckout } from "@sdk/react";
import { CHECKOUT_STEPS } from "@temp/core/config";
import { ITaxedMoney } from "@types";

import * as appPaths from "../../../app/routes/paths";
import { CheckoutRouter } from "./CheckoutRouter";
import {
  CheckoutAddressSubpage,
  CheckoutPaymentSubpage,
  CheckoutReviewSubpage,
  CheckoutShippingSubpage,
  ICheckoutAddressSubpageHandles,
  ICheckoutPaymentSubpageHandles,
  ICheckoutReviewSubpageHandles,
  ICheckoutShippingSubpageHandles,
} from "./subpages";
import { IProps } from "./types";

const prepareCartSummary = (
  totalPrice?: ITaxedMoney | null,
  subtotalPrice?: ITaxedMoney | null,
  shippingTaxedPrice?: ITaxedMoney | null,
  promoTaxedPrice?: ITaxedMoney | null,
  items?: IItems
) => {
  const products = items?.map(({ id, variant, totalPrice, quantity }) => ({
    id: id || "",
    name: variant.name || "",
    price: {
      gross: {
        amount: totalPrice?.gross.amount || 0,
        currency: totalPrice?.gross.currency || "",
      },
      net: {
        amount: totalPrice?.net.amount || 0,
        currency: totalPrice?.net.currency || "",
      },
    },
    quantity,
    sku: variant.sku || "",
    thumbnail: {
      alt: variant.product?.thumbnail?.alt || undefined,
      url: variant.product?.thumbnail?.url,
      url2x: variant.product?.thumbnail2x?.url,
    },
  }));

  return (
    <CartSummary
      shipping={shippingTaxedPrice}
      subtotal={subtotalPrice}
      promoCode={promoTaxedPrice}
      total={totalPrice}
      products={products}
    />
  );
};

const getCheckoutProgress = (activeStepIndex: number) => (
  <CheckoutProgressBar steps={CHECKOUT_STEPS} activeStep={activeStepIndex} />
);

const getButton = (text: string, onClick: () => void) => {
  if (text) {
    return (
      <Button data-cy="checkoutPageBtnNextStep" onClick={onClick} type="submit">
        {text}
      </Button>
    );
  } else {
    return null;
  }
};

const CheckoutPage: React.FC<IProps> = ({}: IProps) => {
  const { pathname } = useLocation();
  const {
    loaded: cartLoaded,
    shippingPrice,
    discount,
    subtotalPrice,
    totalPrice,
    items,
  } = useCart();
  const { loaded: checkoutLoaded, checkout, payment } = useCheckout();

  if (cartLoaded && (!items || !items?.length)) {
    return <Redirect to={appPaths.cartUrl} />;
  }

  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<
    string | undefined
  >(payment?.gateway);
  const [
    selectedPaymentGatewayToken,
    setSelectedPaymentGatewayToken,
  ] = useState<string | undefined>(payment?.token);

  useEffect(() => {
    setSelectedPaymentGateway(payment?.gateway);
  }, [payment?.gateway]);
  useEffect(() => {
    setSelectedPaymentGatewayToken(payment?.token);
  }, [payment?.token]);

  const matchingStepIndex = CHECKOUT_STEPS.findIndex(
    ({ link }) => link === pathname
  );
  const activeStepIndex = matchingStepIndex !== -1 ? matchingStepIndex : 3;
  const activeStep = CHECKOUT_STEPS[activeStepIndex];

  const checkoutAddressSubpageRef = useRef<ICheckoutAddressSubpageHandles>(
    null
  );
  const checkoutShippingSubpageRef = useRef<ICheckoutShippingSubpageHandles>(
    null
  );
  const checkoutPaymentSubpageRef = useRef<ICheckoutPaymentSubpageHandles>(
    null
  );
  const checkoutReviewSubpageRef = useRef<ICheckoutReviewSubpageHandles>(null);

  const handleNextStepClick = () => {
    switch (activeStepIndex) {
      case 0:
        if (checkoutAddressSubpageRef.current?.submitAddress) {
          checkoutAddressSubpageRef.current?.submitAddress();
        }
        break;
      case 1:
        if (checkoutShippingSubpageRef.current?.submitShipping) {
          checkoutShippingSubpageRef.current?.submitShipping();
        }
        break;
      case 2:
        if (checkoutPaymentSubpageRef.current?.submitPayment) {
          checkoutPaymentSubpageRef.current?.submitPayment();
        }
        break;
      case 3:
        if (checkoutReviewSubpageRef.current?.complete) {
          checkoutReviewSubpageRef.current?.complete();
        }
        break;
    }
  };
  const shippingTaxedPrice =
    checkout?.shippingMethod?.id && shippingPrice
      ? {
          gross: shippingPrice,
          net: shippingPrice,
        }
      : null;
  const promoTaxedPrice = discount && {
    gross: discount,
    net: discount,
  };

  const step = useCheckoutStepState(items, checkout, payment);

  const checkoutView =
    cartLoaded && checkoutLoaded ? (
      <CheckoutRouter
        step={step}
        renderAddress={props => (
          <CheckoutAddressSubpage ref={checkoutAddressSubpageRef} {...props} />
        )}
        renderShipping={props => (
          <CheckoutShippingSubpage
            ref={checkoutShippingSubpageRef}
            {...props}
          />
        )}
        renderPayment={props => (
          <CheckoutPaymentSubpage
            ref={checkoutPaymentSubpageRef}
            selectedPaymentGateway={selectedPaymentGateway}
            selectedPaymentGatewayToken={selectedPaymentGatewayToken}
            selectPaymentGateway={setSelectedPaymentGateway}
            {...props}
          />
        )}
        renderReview={props => (
          <CheckoutReviewSubpage
            ref={checkoutReviewSubpageRef}
            selectedPaymentGatewayToken={selectedPaymentGatewayToken}
            {...props}
          />
        )}
      />
    ) : (
      <Loader />
    );

  return (
    <Checkout
      navigation={getCheckoutProgress(activeStepIndex)}
      cartSummary={prepareCartSummary(
        totalPrice,
        subtotalPrice,
        shippingTaxedPrice,
        promoTaxedPrice,
        items
      )}
      checkout={checkoutView}
      button={getButton(
        activeStep.nextActionName.toUpperCase(),
        handleNextStepClick
      )}
    />
  );
};

export { CheckoutPage };
