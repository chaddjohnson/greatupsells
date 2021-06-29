import React, { createContext, useContext } from 'react';
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
  useHttpRequestListener('/cart/add.js', (request) => {
    const product = JSON.parse(request?.responseText || {});

    if (listener) {
      listener.call(listener, product);
    }
  });
};

const useShopifyCartQuantityListener = (listener) => {
  useHttpRequestListener('/cart/change.js', (request) => {
    const params = qs.parse(request._data);
    const lineItemNumber = parseInt(params.line);
    const quantity = parseInt(params.quantity);

    if (listener) {
      listener.call(listener, lineItemNumber, quantity);
    }
  });
};

const httpClient = new HttpClient({
  baseUrl: window.location.origin
});

const CartProvider = ({ children }) => {
  const {
    data: shopifyCartItems,
    error: shopifyCartItemsError,
    mutate: fetchShopifyCartItems
  } = useSWR(
    '/cart.js',
    async () => {
      const data = await httpClient.get('/cart.js');

      return data?.items || [];
    },
    {
      revalidateOnFocus: false
    }
  );
  const shopifyCartItemsLoading = !shopifyCartItems && !shopifyCartItemsError;

  const addProductToShopifyCart = async (variantId, quantity) => {
    await httpClient.post('/cart/add.js', {
      items: [
        {
          id: variantId,
          quantity
        }
      ]
    });
  };

  // Refresh the cart when an item is added.
  useShopifyCartAddListener(() => {
    fetchShopifyCartItems();
  });

  // Refresh the cart when a item's quantity changes.
  useShopifyCartQuantityListener(() => {
    fetchShopifyCartItems();
  });

  usePushStateListener(() => {
    fetchShopifyCartItems();
  });

  return (
    <CartContext.Provider
      value={{
        shopifyCartItems,
        shopifyCartItemsError,
        shopifyCartItemsLoading,
        fetchShopifyCartItems,
        addProductToShopifyCart
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
