import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import {
  useHttpRequestListener,
  usePushStateListener,
  useCookies
} from '@greatupsells/react-hooks';
import useShopifyDraftOrder from './shopifyDraftOrder';
import useShopifyCustomer from './shopifyCustomer';

const CartContext = createContext(null);

const useShopifyCartListener = (listener) => {
  const { getUrlPrefix } = useShopifyCustomer();
  const urlPrefix = getUrlPrefix();
  const url = `${urlPrefix}/cart.js`;

  const handler = (requestData, responseData) => {
    const cartData =
      typeof responseData === 'string'
        ? JSON.parse(responseData)
        : responseData;

    if (listener) {
      listener.call(listener, cartData);
    }
  };

  useHttpRequestListener(url, handler);
};

const useShopifyCartAddListener = (listener) => {
  const { getUrlPrefix } = useShopifyCustomer();
  const urlPrefix = getUrlPrefix();
  const url1 = `${urlPrefix}/cart/add.js`;
  const url2 = `${urlPrefix}/cart/add`;

  const handler1 = (requestData, responseData) => {
    const lineItemData =
      typeof responseData === 'string'
        ? JSON.parse(responseData)
        : responseData;
    const productData = lineItemData?.items?.[0];

    if (listener) {
      listener.call(listener, productData);
    }
  };

  const handler2 = (requestData, responseData) => {
    const productData =
      typeof responseData === 'string'
        ? JSON.parse(responseData)
        : responseData;

    if (listener) {
      listener.call(listener, productData);
    }
  };

  useHttpRequestListener(url1, handler1);
  useHttpRequestListener(url2, handler2);
};

const useShopifyCartQuantityListener = (listener) => {
  const { getUrlPrefix } = useShopifyCustomer();
  const urlPrefix = getUrlPrefix();
  const url1 = `${urlPrefix}/cart/change.js`;
  const url2 = `${urlPrefix}/cart/change`;

  const handler = () => {
    if (listener) {
      listener.call(listener);
    }
  };

  useHttpRequestListener(url1, handler);
  useHttpRequestListener(url2, handler);
};

const CartProvider = ({ children }) => {
  const [cartFormOverridden, setCartFormOverridden] = useState(false);
  const [shopifyCartLoaded, setShopifyCartLoaded] = useState(false);

  const { getCookie, removeCookie } = useCookies();
  const { updateShopifyDraftOrderItems } = useShopifyDraftOrder();
  const { getUrlPrefix } = useShopifyCustomer();
  const urlPrefix = getUrlPrefix();

  const {
    data: shopifyCart,
    error: shopifyCartError,
    mutate: fetchShopifyCart,
    isValidating
  } = useSWR(
    `${urlPrefix}/cart.js`,
    async () => {
      const response = await fetch(`${urlPrefix}/cart.js`);
      const data = response.json();

      return data;
    },
    {
      revalidateOnFocus: false
    }
  );

  const shopifyCartLoading =
    (!shopifyCart && !shopifyCartError) || isValidating;

  const shopifyCartItems = useMemo(() => {
    // Use checkout data if on the Thank You page.
    if (window.Shopify?.Checkout?.page === 'thank_you') {
      return window.Shopify.checkout.line_items.map((lineItem) => ({
        product_id: lineItem.product_id,
        variant_id: lineItem.variant_id,
        quantity: lineItem.quantity
      }));
    }

    // Use Shopify cart data.
    return (
      shopifyCart?.items.map((lineItem) => ({
        product_id: lineItem.product_id,
        variant_id: lineItem.variant_id,
        quantity: lineItem.quantity
      })) || []
    );
  }, [shopifyCart]);

  const shopifyCartTotal = useMemo(() => {
    // Use checkout data if on the Thank You page.
    if (window.Shopify?.Checkout?.page === 'thank_you') {
      return parseFloat(window.Shopify.checkout.total_price);
    }

    // Use Shopify cart data.
    return (shopifyCart?.total_price && shopifyCart?.total_price / 100) || 0;
  }, [shopifyCart]);

  const shopifyCartItemCount = useMemo(
    () => shopifyCartItems.reduce((sum, item) => sum + item.quantity, 0),
    [shopifyCartItems]
  );

  const addVariantsToShopifyCart = async (variants) => {
    await fetch(`${urlPrefix}/cart/add.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: variants.map(({ shopifyVariantId, quantity }) => ({
          id: shopifyVariantId,
          quantity
        }))
      })
    });
  };

  const removeVariantFromShopifyCart = async (
    shopifyVariantId,
    quantity = 1
  ) => {
    const variant = shopifyCartItems.find(
      (item) => item.variant_id === shopifyVariantId
    );
    const newQuantity = Math.max(variant.quantity - quantity, 0);

    await fetch(`${urlPrefix}/cart/update.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates: {
          [shopifyVariantId]: newQuantity
        }
      })
    });
  };

  const findTriggerProductShopifyVariantId = (triggerProduct) => {
    if (!triggerProduct) {
      return;
    }

    const { shopifyProductId, shopifyProductData } = triggerProduct;
    const { variants } = shopifyProductData;

    // Find the cart item corresponding to the product.
    const shopifyCartItem = shopifyCartItems.find(
      (item) => item.product_id === shopifyProductId
    );

    // Find the specific variant.
    const hasVariants = variants.length > 1;
    const variant =
      hasVariants &&
      shopifyCartItem &&
      variants.find((current) => current.id === shopifyCartItem.variant_id);

    return variant?.id;
  };

  const handleCartFormSubmit = useCallback((event) => {
    // Prevent default form handling (which redirects to the normal cart page).
    event.preventDefault();

    const draftOrderId = getCookie('greatupsellsDraftOrderId');
    const draftOrderCheckoutUrl = getCookie('greatupsellsDraftOrderInvoiceUrl');

    if (!draftOrderId || !draftOrderCheckoutUrl) {
      return;
    }

    // Redirect to the draft order checkout URL.
    window.location.href = draftOrderCheckoutUrl;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const overrideCartForm = useCallback(() => {
    const draftOrderId = getCookie('greatupsellsDraftOrderId');
    const draftOrderCheckoutUrl = getCookie('greatupsellsDraftOrderInvoiceUrl');
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

  // Intercept add to cart HTTP requests, and synchronize items to the draft order
  // if there is a draft order being tracked.
  const shopifyCartChangeListener = async () => {
    const draftOrderId = getCookie('greatupsellsDraftOrderId');
    let draftOrder = null;

    const latestShopifyCart = await fetchShopifyCart();
    const latestShopifyCartItems = latestShopifyCart?.items || [];

    if (draftOrderId) {
      draftOrder = await updateShopifyDraftOrderItems(
        draftOrderId,
        latestShopifyCartItems
      );

      if (draftOrder) {
        // Override event handling for cart forms.
        overrideCartForm();
      } else {
        // Remove cookies as draft order no longer exists.
        removeCookie('greatupsellsDraftOrderId');
        removeCookie('greatupsellsDraftOrderInvoiceUrl');

        // Undo cart form overrides.
        removeCartFormOverrides();
      }
    }
  };

  if (!shopifyCartLoaded && !shopifyCartLoading) {
    setShopifyCartLoaded(true);
  }

  useShopifyCartAddListener(shopifyCartChangeListener);
  useShopifyCartQuantityListener(shopifyCartChangeListener);

  usePushStateListener(async () => {
    await fetchShopifyCart();
    setCartFormOverridden(false);
  });

  useShopifyCartListener((response) => {
    // Remove cookies relaeted to draft orders when there are no cart items.
    if (response?.items.length === 0) {
      removeCookie('greatupsellsDraftOrderId');
      removeCookie('greatupsellsDraftOrderInvoiceUrl');
    }
  });

  // This is related to pushState handling above.
  useEffect(() => {
    overrideCartForm();
  }, [cartFormOverridden]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Override event handling for cart forms on load.
    overrideCartForm();

    // Re-fetch cart items on load.
    fetchShopifyCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CartContext.Provider
      value={{
        shopifyCartItems,
        shopifyCartTotal,
        shopifyCartItemCount,
        shopifyCartError,
        shopifyCartLoading,
        shopifyCartLoaded,
        fetchShopifyCart,
        addVariantsToShopifyCart,
        removeVariantFromShopifyCart,
        findTriggerProductShopifyVariantId
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useShopifyCart = () => useContext(CartContext);

export {
  CartProvider,
  useShopifyCart,
  useShopifyCartAddListener,
  useShopifyCartQuantityListener
};
