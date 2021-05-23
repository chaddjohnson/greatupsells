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

  const addProductToShopifyCart = async (variantId, quantity, attempts = 1) => {
    if (attempts > 5) {
      return;
    }

    try {
      await httpClient.post(
        '/cart/add.js',
        {
          items: [
            {
              id: variantId,
              quantity
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1 * 1000));
      await addProductToShopifyCart(variantId, quantity, ++attempts);
    }
  };

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

export { CartProvider, useShopifyCart, useShopifyCartProductAddListener };
