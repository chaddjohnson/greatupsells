/* eslint-disable react/prop-types */

/**
 * Extend Shopify Checkout with a custom Post Purchase user experience.
 * This template provides two extension points:
 *
 *  1. ShouldRender - Called first, during the checkout process, when the
 *     payment page loads.
 *  2. Render - If requested by `ShouldRender`, will be rendered after checkout
 *     completes
 */
import React from 'react';
import { extend, render } from '@shopify/post-purchase-ui-extensions-react';
import PostCheckoutOffer1 from '../../../../../packages/themes/dist/PostCheckoutOffer1';
import useOfferThemeState from '../../../../../packages/react-components/src/OfferTheme/offerThemeState';
import useOfferThemeVariables from '../../../../../packages/react-components/src/OfferTheme/offerThemeVariables';

// TODO
import dummyData from './dummyData.json';

/**
 * Entry point for the `ShouldRender` Extension Point.
 *
 * Returns a value indicating whether or not to render a PostPurchase step, and
 * optionally allows data to be stored on the client for use in the `Render`
 * extension point.
 */
extend('Checkout::PostPurchase::ShouldRender', async ({ storage }) => {
  const initialState = await getRenderData();
  const render = true; // eslint-disable-line no-shadow

  if (render) {
    // Saves initial state, provided to `Render` via `storage.initialData`
    await storage.update(initialState);
  }

  return {
    render
  };
});

// Simulate results of network call, etc.
async function getRenderData() {
  return dummyData;
}

/**
 * Entry point for the `Render` Extension Point
 *
 * Returns markup composed of remote UI components.  The Render extension can
 * optionally make use of data stored during `ShouldRender` extension point to
 * expedite time-to-first-meaningful-paint.
 */
render('Checkout::PostPurchase::Render', App);

const OfferTheme = ({
  offer,
  theme,
  triggerProduct,
  offeredProducts,
  forceDisplayType
}) => {
  const themeVariables = useOfferThemeVariables(offer, theme);

  // TODO
  const state = useOfferThemeState({
    // TODO
    shop: {
      countryCode: 'US',
      currency: 'USD',
      locale: 'en',
      timezone: 'America/New_York'
    },
    offer,
    locale: 'en', // TODO
    countryCode: 'US', // TODO
    currency: 'USD', // TODO
    triggerProduct,
    offeredProducts,
    shopifyCartItems: [], // TODO
    shopifyCartTotal: 0, // TODO
    shopifyCartItemCount: 0, // TODO
    onAddProducts: () => {}, // TODO
    onReplaceProduct: () => {}, // TODO
    handlers: {
      //
    }
  });

  return (
    <PostCheckoutOffer1
      theme={themeVariables}
      state={{ ...state, forceDisplayType }}
    />
  );
};

// Top-level React component
export function App({ extensionPoint, storage }) {
  const { offer, theme, triggerProduct, offeredProducts } = storage.initialData;
  const forceDisplayType = 'desktop';

  return (
    <OfferTheme
      offer={offer}
      theme={theme}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      forceDisplayType={forceDisplayType}
    />
  );
}
