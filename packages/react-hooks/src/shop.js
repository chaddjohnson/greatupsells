import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useSWR, { mutate } from 'swr';
import { Context as AppBridgeContext } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { getCookie, setCookie } from '@neatowebsolutions/upselling-utilities';
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
  const shopOrigin =
    sessionStorage.getItem('shopOrigin') || getCookie('shopOrigin');

  if (window.top === window.self) {
    window.top.location.href = `${process.env.SHOPIFY_ADMIN_URL}/auth?shop=${shopOrigin}`;
  } else {
    // Use Shopify to redirect when the app is in an iframe.
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${process.env.SHOPIFY_ADMIN_URL}/auth?shop=${shopOrigin}`,
      newContext: true
    });
  }
};

export const ShopProvider = ({ children }) => {
  const app = useContext(AppBridgeContext);

  const [initializingAuth, setInitializingAuth] = useState(false);

  const { data: shopToken, error: shopTokenError } = useSWR(
    typeof window !== 'undefined' && window.location.search
      ? [SHOP_TOKEN_QUERY, window.location.search]
      : null,
    (query, queryString) => graphqlClient.query(query, { queryString }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false
    }
  );

  const { data: shop, error: shopError, mutate: fetchShop } = useSWR(
    shopToken ? SHOP_QUERY : null,
    graphqlClient.query,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onError: () => {
        // Perform OAuth if no shop can be fetched. For example, if the shop token is invalid
        // due to another instance of this app running for naother shop.
        if (!initializingAuth) {
          setInitializingAuth(true);
          initializeAuth(app);
        }
      }
    }
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
    // OAuth must be performed if no token is available, there is an error retrieving a token
    // and OAuth is not being performed.
    const performOauth =
      !shopToken?.token && shopTokenError && !initializingAuth;

    if (shopToken?.token && !shopTokenError) {
      // Save the token to session storage to allow use in the current tab.
      sessionStorage.setItem('authToken', shopToken.token);

      // Save the token to a cookie to facilitate server-side rendering.
      setCookie('authToken', shopToken.token);
    }

    // Fetch shop data if the access token is available.
    if (shopToken?.token && !performOauth) {
      fetchShop();
    }

    if (performOauth) {
      setInitializingAuth(true);
      initializeAuth(app);
    }
  }, [shopToken, shopTokenError, initializingAuth, app, fetchShop]); // eslint-disable-line react-hooks/exhaustive-deps

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
