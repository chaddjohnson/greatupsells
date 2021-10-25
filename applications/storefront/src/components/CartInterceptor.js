import React, { useState, useCallback, useEffect } from 'react';
import {
  useCookies,
  usePushStateListener
} from '@neatowebsolutions/greatupsells-react-hooks';
import {
  useShopifyCart,
  useShopifyDraftOrder,
  useShopifyCartAddListener,
  useShopifyCartQuantityListener
} from '../hooks';

const CartInterceptor = () => {
  const [cartFormOverridden, setCartFormOverridden] = useState(false);

  const { getCookie, removeCookie } = useCookies();
  const { shopifyCartItems } = useShopifyCart();
  const {
    addVariantToShopifyDraftOrder,
    updateShopifyDraftOrderVariantQuantity
  } = useShopifyDraftOrder();

  const handleCartFormSubmit = useCallback((event) => {
    // Prevent default form handling (which redirects to the normal cart page).
    event.preventDefault();

    const draftOrderId = getCookie('greatupsellsDraftOrderId');
    const draftOrderCheckoutUrl = getCookie(
      'greatupsellsDraftOrderCheckoutUrl'
    );

    if (!draftOrderId || !draftOrderCheckoutUrl) {
      return;
    }

    // Redirect to the draft order checkout URL.
    window.location.href = draftOrderCheckoutUrl;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const overrideCartForm = useCallback(() => {
    const draftOrderId = getCookie('greatupsellsDraftOrderId');
    const draftOrderCheckoutUrl = getCookie(
      'greatupsellsDraftOrderCheckoutUrl'
    );
    const cartForms = Array.from(document.forms).filter((form) =>
      form.action.match(/\/cart$/)
    );
    const additionalCheckoutButtons = document.querySelector(
      '.additional-checkout-buttons'
    );

    // Abort if already overridden.
    if (cartFormOverridden) {
      return;
    }

    // Abort the override if no draft order is in place.
    if (!draftOrderId || !draftOrderCheckoutUrl) {
      return;
    }

    // Replace event handlers for cart forms.
    cartForms.forEach((cartForm) => {
      cartForm.addEventListener('submit', handleCartFormSubmit, true);
    });

    // Hide additional checkout buttons.
    if (additionalCheckoutButtons) {
      additionalCheckoutButtons.style.display = 'none';
    }

    // Mark override as done.
    setCartFormOverridden(true);
  }, [cartFormOverridden]); // eslint-disable-line react-hooks/exhaustive-deps

  const removeCartFormOverrides = useCallback(() => {
    const cartForms = Array.from(document.forms).filter((form) =>
      form.action.match(/\/cart$/)
    );
    const additionalCheckoutButtons = document.querySelector(
      '.additional-checkout-buttons'
    );

    // Remove event handlers for cart forms.
    cartForms.forEach((cartForm) => {
      cartForm.removeEventListener('submit', handleCartFormSubmit, true);
    });

    // Show additional checkout buttons.
    if (additionalCheckoutButtons) {
      additionalCheckoutButtons.style.display = 'block';
    }

    // Mark override as not done.
    setCartFormOverridden(false);
  }, [handleCartFormSubmit]);

  const shopifyCartAddListener = async (addedProduct) => {
    if (!addedProduct) {
      return;
    }

    const { variant_id: shopifyVariantId } = addedProduct;
    const draftOrderId = getCookie('greatupsellsDraftOrderId');

    // Only add to an existing draft order. Do not create a new draft order
    // unnecessarily. Draft orders are only leveraged if one or more offers
    // have been accepted.
    if (shopifyVariantId && draftOrderId) {
      await addVariantToShopifyDraftOrder(draftOrderId, {
        shopifyVariantId
      });

      // Override event handling for cart forms.
      overrideCartForm();
    }
  };

  const shopifyCartQuantityListener = async (lineItemNumber, quantity) => {
    const draftOrderId = getCookie('greatupsellsDraftOrderId');
    const lineItem = shopifyCartItems[lineItemNumber - 1];
    const shopifyVariantId = parseInt(lineItem.variant_id);
    let draftOrder = null;

    if (draftOrderId) {
      draftOrder = await updateShopifyDraftOrderVariantQuantity(
        draftOrderId,
        shopifyVariantId,
        quantity
      );

      if (draftOrder) {
        // Override event handling for cart forms.
        overrideCartForm();
      } else {
        // Remove cookies as draft order no longer exists.
        removeCookie('greatupsellsDraftOrderId');
        removeCookie('greatupsellsDraftOrderCheckoutUrl');

        // Refresh in order to undo cart form overrides.
        // window.location.reload();
        removeCartFormOverrides();
      }
    }
  };

  // Intercept add to cart HTTP requests, and add products to the draft order
  // on add to cart if there is a draft order being tracked.
  useShopifyCartAddListener(shopifyCartAddListener);

  // Intercept cart quantity change HTTP requests, and update products in the
  // draft order on cart quantity change if there is a draft order being tracked.
  useShopifyCartQuantityListener(shopifyCartQuantityListener);

  // Override event handling for cart forms on pushState.
  usePushStateListener(() => {
    setCartFormOverridden(false);
  });

  // This is related to pushState handling above.
  useEffect(() => {
    overrideCartForm();
  }, [cartFormOverridden]); // eslint-disable-line react-hooks/exhaustive-deps

  // Override event handling for cart forms on load.
  useEffect(() => {
    overrideCartForm();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default CartInterceptor;
