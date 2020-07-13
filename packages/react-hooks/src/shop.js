import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import useSWR, { mutate } from 'swr';
import { graphqlClient, SHOP_QUERY, UPDATE_SHOP_MUTATION } from './graphql';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const { data: shop, error: shopError } = useSWR(
    SHOP_QUERY,
    graphqlClient.query
  );
  const shopLoading = !shop && !shopError;

  const fetchShop = async () => {
    return mutate(SHOP_QUERY);
  };

  const updateShop = async (data) => {
    await mutate(UPDATE_SHOP_MUTATION, (query) =>
      graphqlClient.mutate(query, data)
    );
    mutate(SHOP_QUERY);
  };

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopLoading,
        shopError,
        fetchShop,
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
