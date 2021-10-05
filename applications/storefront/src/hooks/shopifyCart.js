import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import qs from 'querystringify';
import {
  useHttpRequestListener,
  usePushStateListener,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';

const CartContext = createContext(null);

const useShopifyCartAddListener = (listener) => {
  const handler = (request) => {
    const product = JSON.parse(request?.responseText || {});

    if (listener) {
      listener.call(listener, product);
    }
  };

  useHttpRequestListener('/cart/add.js', handler);
  useHttpRequestListener('/cart/add', handler);
};

const useShopifyCartQuantityListener = (listener) => {
  const handler = (request) => {
    const params = qs.parse(request._data);
    const lineItemNumber = parseInt(params.line);
    const quantity = parseInt(params.quantity);

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

  const addVariantToShopifyCart = async (shopifyVariantId, quantity) => {
    await httpClient.post('/cart/add.js', {
      items: [
        {
          id: shopifyVariantId,
          quantity
        }
      ]
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
    await addVariantToShopifyCart(shopifyVariantId, quantity);
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

  return (
    <CartContext.Provider
      value={{
        shopifyCartItems,
        shopifyCartTotal,
        shopifyCartItemCount,
        shopifyCartError,
        shopifyCartLoading,
        fetchShopifyCart,
        addVariantToShopifyCart,
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
