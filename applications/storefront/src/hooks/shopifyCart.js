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
  useCookies,
  HttpClient
} from '@greatupsells/react-hooks';
import useShopifyDraftOrder from './shopifyDraftOrder';

const CartContext = createContext(null);

const useShopifyCartListener = (listener) => {
  const handler = (requestData, responseData) => {
    const cartData =
      typeof responseData === 'string'
        ? JSON.parse(responseData)
        : responseData;

    if (listener) {
      listener.call(listener, cartData);
    }
  };

  useHttpRequestListener('/cart.js', handler);
};

const useShopifyCartAddListener = (listener) => {
  const handler1 = (requestData, responseData) => {
    const productData = responseData?.items?.[0];

    if (listener) {
      listener.call(listener, productData);
    }
  };

  const handler2 = (requestData, responseData) => {
    if (listener) {
      listener.call(listener, responseData);
    }
  };

  useHttpRequestListener('/cart/add.js', handler1);
  useHttpRequestListener('/cart/add', handler2);
};

const useShopifyCartQuantityListener = (listener) => {
  const handler = () => {
    if (listener) {
      listener.call(listener);
    }
  };

  useHttpRequestListener('/cart/change.js', handler);
  useHttpRequestListener('/cart/change', handler);
};

const httpClient = new HttpClient({
  baseUrl: window.location.origin
});

const CartProvider = ({ children }) => {
  const [cartFormOverridden, setCartFormOverridden] = useState(false);

  const { getCookie, removeCookie } = useCookies();
  const { updateShopifyDraftOrderItems } = useShopifyDraftOrder();

  const {
    data: shopifyCart,
    error: shopifyCartError,
    mutate: fetchShopifyCart,
    isValidating
  } = useSWR(
    '/cart.js',
    async () => {
      return await httpClient.get('/cart.js');
    },
    {
      revalidateOnFocus: false
    }
  );
  const shopifyCartLoading =
    (!shopifyCart && !shopifyCartError) || isValidating;
  const shopifyCartItems = useMemo(() => shopifyCart?.items || [], [
    shopifyCart
  ]);
  const shopifyCartTotal = useMemo(
    () => shopifyCart?.total_price && shopifyCart?.total_price / 100,
    [shopifyCart]
  );
  const shopifyCartItemCount = useMemo(
    () => shopifyCartItems.reduce((sum, item) => sum + item.quantity, 0),
    [shopifyCartItems]
  );

  const addVariantsToShopifyCart = async (variants) => {
    await httpClient.post('/cart/add.js', {
      items: variants.map(({ shopifyVariantId, quantity }) => ({
        id: shopifyVariantId,
        quantity
      }))
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

    await httpClient.post('/cart/update.js', {
      updates: {
        [shopifyVariantId]: newQuantity
      }
    });
  };

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
        removeCookie('greatupsellsDraftOrderCheckoutUrl');

        // Undo cart form overrides.
        removeCartFormOverrides();
      }
    }
  };

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
      removeCookie('greatupsellsDraftOrderCheckoutUrl');
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
        fetchShopifyCart,
        addVariantsToShopifyCart,
        removeVariantFromShopifyCart
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
