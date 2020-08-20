import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useSWR, { mutate } from 'swr';
import {
  graphqlClient,
  SHOP_QUERY,
  UPDATE_SHOP_MUTATION
} from '@neatowebsolutions/upselling-graphql';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const { data: shop, error: shopError, mutate: fetchShop } = useSWR(
    SHOP_QUERY,
    graphqlClient.query
  );

  const shopLoading = !shop && !shopError;

  const updateShop = async (data) => {
    const updatedShop = await mutate(
      UPDATE_SHOP_MUTATION,
      graphqlClient.mutate(UPDATE_SHOP_MUTATION, data)
    );

    await mutate(SHOP_QUERY, updatedShop, false);
  };

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopLoading,
        shopError,
        updateShop,
        fetchShop
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
