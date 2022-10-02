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
import { OfferTheme } from './components';
import loadData from './utilities/loadData';

const App = ({ storage }) => {
  const {
    shop,
    shopifyCartItems,
    shopifyCartTotal,
    shopifyCartItemCount,
    offer,
    theme,
    triggerProduct,
    offeredProducts,
    referenceId,
    token
  } = storage.initialData || {};

  if (!storage.initialData) {
    return null;
  }

  return (
    <OfferTheme
      shop={shop}
      offer={offer}
      theme={theme}
      triggerProduct={triggerProduct}
      offeredProducts={offeredProducts}
      shopifyCartItems={shopifyCartItems}
      shopifyCartTotal={shopifyCartTotal}
      shopifyCartItemCount={shopifyCartItemCount}
      referenceId={referenceId}
      token={token}
    />
  );
};

/**
 * Entry point for the `ShouldRender` Extension Point.
 *
 * Returns a value indicating whether or not to render a PostPurchase step, and
 * optionally allows data to be stored on the client for use in the `Render`
 * extension point.
 */
extend(
  'Checkout::PostPurchase::ShouldRender',
  async ({ inputData, storage }) => {
    const { shop, initialPurchase, token } = inputData;
    const { referenceId } = initialPurchase;
    const { domain } = shop;
    const data = await loadData(domain, initialPurchase);
    const { offer, offeredProducts } = data;
    const shouldRender = !!offer && offeredProducts.length > 0;

    if (shouldRender) {
      // Saves initial state, provided to `Render` via `storage.initialData`.
      await storage.update({ ...data, referenceId, token });
    }

    return {
      render: shouldRender
    };
  }
);

/**
 * Entry point for the `Render` Extension Point
 *
 * Returns markup composed of remote UI components.  The Render extension can
 * optionally make use of data stored during `ShouldRender` extension point to
 * expedite time-to-first-meaningful-paint.
 */
render('Checkout::PostPurchase::Render', App);

export { App };
