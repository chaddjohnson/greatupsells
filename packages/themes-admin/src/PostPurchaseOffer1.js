import React, { useState, useEffect } from 'react';
import {
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  Text,
  TextBlock,
  TextContainer,
  Tiles,
  Select,
  View
} from '@shopify/checkout-ui-react';
import { Context } from '@shopify/checkout-ui-react/argo';
import PostPurchaseOffer1 from '@greatupsells/themes/PostPurchaseOffer1';

const components = {
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  Text,
  TextBlock,
  TextContainer,
  Tiles,
  Select,
  View
};

const injectStyles = () => {
  const iframes = Array.from(document.getElementsByClassName('offer-iframe'));
  const parentStyleElement = document.getElementById('offer-styles');
  let styleElement = null;
  const styleElements = [];

  if (iframes.length > 0) {
    iframes.forEach((iframe) => {
      styleElement = iframe.contentDocument.createElement('style');
      styleElement.innerText = parentStyleElement.innerText;
      iframe.contentDocument.head.appendChild(styleElement);
      styleElements.push({
        parent: iframe.contentDocument.head,
        element: styleElement
      });
    });
  }

  return () => {
    styleElements.forEach(({ parent, element }) => {
      parent.removeChild(element);
    });
  };
};

export default ({ state, ...props }) => {
  const [stylesInjected, setStylesInjected] = useState(false);
  const { selectedVariants } = state;
  const selectedVariant = selectedVariants[0];

  // Inject dummy values.
  state = {
    subtotalPrice: selectedVariant.salePrice,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: selectedVariant.salePrice,
    subtotalPriceFormatted: selectedVariant.salePriceFormatted,
    shippingPriceFormatted: 'Free',
    taxPriceFormatted: 'Free',
    totalPriceFormatted: selectedVariant.salePriceFormatted,
    ...state
  };

  useEffect(() => {
    let removeStyles = () => {};

    setTimeout(() => {
      removeStyles = injectStyles();
      setStylesInjected(true);
    });

    return () => {
      removeStyles();
    };
  }, []);

  if (!stylesInjected) {
    return null;
  }

  return (
    <Context>
      <PostPurchaseOffer1 components={components} state={state} {...props} />
    </Context>
  );
};
