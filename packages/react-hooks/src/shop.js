import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import useSWR, { mutate } from 'swr';
import { graphqlClient, SHOP_QUERY, UPDATE_SHOP_MUTATION } from './graphql';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const {
    data: shop,
    error: shopError,
    isValidating: shopIsValidating
  } = useSWR(SHOP_QUERY, graphqlClient.query);
  const shopLoading = (!shop && !shopError) || shopIsValidating;

  const updateShop = async (data) => {
    await mutate(
      UPDATE_SHOP_MUTATION,
      graphqlClient.mutate(UPDATE_SHOP_MUTATION, data)
    );
    mutate(SHOP_QUERY);
  };

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopLoading,
        shopError,
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

export const useShop = () => useShop(ShopContext);
