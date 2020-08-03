import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useSWR, { mutate } from 'swr';
import { Context as AppBridgeContext } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import Cookies from 'js-cookie';
import {
  graphqlClient,
  SHOP_QUERY,
  SHOP_TOKEN_QUERY,
  UPDATE_SHOP_MUTATION
} from './graphql';

const ShopContext = createContext(null);

const initializeAuth = (app) => {
  if (typeof window === 'undefined') {
    return;
  }

  const redirect = Redirect.create(app);

  if (window.top === window.self) {
    window.top.location.href = `${
      process.env.SHOPIFY_ADMIN_URL
    }/auth?shop=${Cookies.get('shopOrigin')}`;
  } else {
    // Use Shopify to redirect when the app is in an iframe.
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${process.env.SHOPIFY_ADMIN_URL}/auth?shop=${Cookies.get(
        'shopOrigin'
      )}`,
      newContext: false
    });
  }
};

export const ShopProvider = ({ children }) => {
  const app = useContext(AppBridgeContext);

  const [initializingAuth, setInitializingAuth] = useState(false);

  const { data: shop, error: shopError } = useSWR(
    SHOP_QUERY,
    graphqlClient.query
  );

  const { data: shopToken, error: shopTokenError } = useSWR(
    typeof window !== 'undefined'
      ? [SHOP_TOKEN_QUERY, window.location.search]
      : null,
    (query, queryString) => graphqlClient.query(query, { queryString }),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const shopLoading = !shop && !shopError;

  const updateShop = async (data) => {
    await mutate(
      UPDATE_SHOP_MUTATION,
      graphqlClient.mutate(UPDATE_SHOP_MUTATION, data)
    );
    await mutate(SHOP_QUERY);
  };

  useEffect(() => {
    if (shopToken && !shopTokenError) {
      // Save the auth token to sessionStorage for runtime use in the current tab only.
      sessionStorage.setItem('authToken', shopToken.token);
    }

    if (shopTokenError && !initializingAuth) {
      setInitializingAuth(true);
      initializeAuth(app);
    }
  }, [shopToken, shopTokenError, initializingAuth, app]);

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopToken,
        shopLoading,
        shopError,
        shopTokenError,
        updateShop
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

ShopProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useShop = () => useContext(ShopContext);
