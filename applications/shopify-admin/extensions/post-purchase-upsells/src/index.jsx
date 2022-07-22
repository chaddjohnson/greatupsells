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

/**
 * Entry point for the `ShouldRender` Extension Point.
 *
 * Returns a value indicating whether or not to render a PostPurchase step, and
 * optionally allows data to be stored on the client for use in the `Render`
 * extension point.
 */
extend('Checkout::PostPurchase::ShouldRender', async ({ storage }) => {
  const initialState = await getRenderData();
  const render = true;

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
  return {
    couldBe: 'anything'
  };
}

/**
 * Entry point for the `Render` Extension Point
 *
 * Returns markup composed of remote UI components.  The Render extension can
 * optionally make use of data stored during `ShouldRender` extension point to
 * expedite time-to-first-meaningful-paint.
 */
render('Checkout::PostPurchase::Render', App);

// Top-level React component
export function App({ extensionPoint, storage }) {
  const initialState = storage.initialData;
  const state = {};
  const forceDisplayType = 'desktop';
  // const ThemeComponent = useThemeComponent('PostCheckoutOffer1');
  // const themeVariables = useOfferThemeVariables(offer, theme);
  const themeVariables = {
    showOriginalPrice: 'true',
    salePriceTextColor: '#3D4246',
    buttonTextColor: '#FFFFFF',
    buttonBackgroundColor: '#1878b9',
    addButtonText: 'Buy now',
    originalPriceTextColor: '#999999',
    productTitleTextColor: '#3D4246',
    showPrices: 'true',
    titleText: 'Recommended'
  };

  return (
    <PostCheckoutOffer1
      theme={themeVariables}
      state={{ ...state, forceDisplayType }}
    />
  );
}
