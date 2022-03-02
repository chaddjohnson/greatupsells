import React, { createContext, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import {
  useHttpRequestListener,
  usePushStateListener,
  useCookies,
  HttpClient
} from '@greatupsells/react-hooks';

const CartContext = createContext(null);

const useShopifyCartAddListener = (listener) => {
  const handler = (requestData, responseData) => {
    const productData = responseData?.items
      ? responseData.items[0]
      : responseData;

    if (listener) {
      listener.call(listener, productData);
    }
  };

  useHttpRequestListener('/cart/add.js', handler);
  useHttpRequestListener('/cart/add', handler);
};

const useShopifyCartQuantityListener = (listener) => {
  const handler = (requestData) => {
    const jsonData = JSON.parse(requestData);
    const lineItemNumber = parseInt(jsonData.line);
    const quantity = parseInt(jsonData.quantity);

    if (listener) {
      listener.call(listener, lineItemNumber, quantity);
    }
  };

  useHttpRequestListener('/cart/change.js', handler);
  useHttpRequestListener('/cart/change', handler);
};

const httpClient = new HttpClient({
  baseUrl: window.location.origin
});

const CartProvider = ({ children }) => {
  const { removeCookie } = useCookies();

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

  const removeVariantFromShopifyCart = async (shopifyVariantId) => {
    await httpClient.post('/cart/update.js', {
      updates: {
        [shopifyVariantId]: 0
      }
    });
  };

  const replaceVariantInShopifyCart = async (
    originalShopifyVariantId,
    shopifyVariantId,
    quantity
  ) => {
    // Remove the original variant from the cart.
    await removeVariantFromShopifyCart(originalShopifyVariantId);

    // Add the new variant to the cart.
    await addVariantsToShopifyCart([{ shopifyVariantId, quantity }]);
  };

  // Refresh the cart when an item is added.
  useShopifyCartAddListener(() => {
    fetchShopifyCart();
  });

  // Refresh the cart when a item's quantity changes.
  useShopifyCartQuantityListener(() => {
    fetchShopifyCart();
  });

  usePushStateListener(() => {
    fetchShopifyCart();
  });

  useEffect(() => {
    // Remove cookies related to draft orders when there are no cart items.
    if (shopifyCartItems.length === 0) {
      removeCookie('greatupsellsDraftOrderId');
      removeCookie('greatupsellsDraftOrderCheckoutUrl');
    }
  }, [shopifyCartItems, removeCookie]);

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
        removeVariantFromShopifyCart,
        replaceVariantInShopifyCart
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
