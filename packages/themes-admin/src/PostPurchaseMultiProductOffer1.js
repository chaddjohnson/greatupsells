import React, { useState, useEffect } from 'react';
import {
  BlockStack,
  InlineStack,
  Button,
  Banner,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  Text,
  TextBlock,
  TextContainer,
  Select,
  Tiles,
  View
} from '@shopify/checkout-ui-react';
import { Context } from '@shopify/checkout-ui-react/argo';
import PostPurchaseMultiProductOffer1 from '@greatupsells/themes/PostPurchaseMultiProductOffer1';
import injectStyles from './utilities/injectStyles';

const components = {
  BlockStack,
  InlineStack,
  Button,
  Banner,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  Text,
  TextBlock,
  TextContainer,
  Select,
  Tiles,
  View
};

export default ({ state, ...props }) => {
  const [stylesInjected, setStylesInjected] = useState(false);
  const { selectedVariants } = state;

  // Inject dummy values.
  state = {
    subtotalPricesFormatted: selectedVariants.map(({ salePriceFormatted }) => salePriceFormatted),
    shippingPricesFormatted: selectedVariants.map(() => 'Free'),
    taxPricesFormatted: selectedVariants.map(() => 'Free'),
    totalPrices: selectedVariants.map(({ salePrice }) => salePrice),
    totalPricesFormatted: selectedVariants.map(({ salePriceFormatted }) => salePriceFormatted),
    ...state
  };

  useEffect(() => {
    let removeStyles = () => {};

    removeStyles = injectStyles('PostPurchaseMultiProductOffer1');
    setStylesInjected(true);

    return () => {
      removeStyles();
    };
  }, []);

  if (!stylesInjected) {
    return null;
  }

  return (
    <Context>
      <PostPurchaseMultiProductOffer1 components={components} state={state} {...props} />
    </Context>
  );
};
