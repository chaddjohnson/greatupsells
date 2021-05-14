import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import {
  useHttpRequestListener,
  usePushStateListener
} from '@neatowebsolutions/upselling-react-hooks';

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const {
    data: shopifyCartItems,
    error: shopifyCartItemsError,
    mutate: fetchShopifyCartItems
  } = useSWR(
    '/cart.js',
    async () => {
      const response = await fetch('/cart.js');
      const data = await response.json();

      return data?.items || [];
    },
    {
      revalidateOnFocus: false
    }
  );
  const shopifyCartItemsLoading = !shopifyCartItems && !shopifyCartItemsError;

  const addProductToShopifyCart = async (variantId, quantity) => {
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          {
            id: variantId,
            quantity
          }
        ]
      })
    });
  };

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

const useShopifyCartProductAddListener = (listener) => {
  useHttpRequestListener('/cart/add.js', (request) => {
    const product = JSON.parse(request?.responseText || {});

    if (listener) {
      listener.call(listener, product);
    }
  });
};

export { CartProvider, useShopifyCart, useShopifyCartProductAddListener };
