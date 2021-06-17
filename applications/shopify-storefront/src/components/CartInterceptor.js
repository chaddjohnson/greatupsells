import React from 'react';
import { useCookies } from '@neatowebsolutions/upselling-react-hooks';
import {
  useShopifyDraftOrder,
  useShopifyCartProductAddListener
} from '../hooks';

const CartInterceptor = () => {
  const { getCookie } = useCookies();
  const { addProductToShopifyDraftOrder } = useShopifyDraftOrder();

  // Intercept add to cart HTTP requests, and add products to the draft order
  // on add to cart if there is a draft order being tracked.
  useShopifyCartProductAddListener(async (addedProduct) => {
    if (!addedProduct) {
      return;
    }

    const { variant_id: shopifyVariantId, quantity } = addedProduct;
    const draftOrderId = getCookie('upsellingDraftOrderId');

    // Only add to an existing draft order. Do not create a new draft order
    // unnecessarily. Draft orders are only leveraged if one or more offers
    // have been accepted.
    if (shopifyVariantId && draftOrderId) {
      await addProductToShopifyDraftOrder(draftOrderId, {
        shopifyVariantId,
        quantity
      });
    }
  });

  return null;
};

export default CartInterceptor;
