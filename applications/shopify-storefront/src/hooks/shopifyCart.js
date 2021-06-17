import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import {
  useHttpRequestListener,
  usePushStateListener,
  HttpClient
} from '@neatowebsolutions/upselling-react-hooks';

const CartContext = createContext(null);

const useShopifyCartProductAddListener = (listener) => {
  useHttpRequestListener('/cart/add.js', (request) => {
    const product = JSON.parse(request?.responseText || {});

    if (listener) {
      listener.call(listener, product);
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

  useShopifyCartProductAddListener(() => {
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
        fetchShopifyCartItems
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

export { CartProvider, useShopifyCart, useShopifyCartProductAddListener };
