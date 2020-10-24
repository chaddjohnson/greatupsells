import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  useQuery,
  useMutation
} from '@neatowebsolutions/upselling-graphql-client';
import {
  SHOP_QUERY,
  UPDATE_SHOP_MUTATION
} from '@neatowebsolutions/upselling-graphql-queries';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const {
    data: shop,
    loading: shopLoading,
    error: shopError,
    mutate: mutateShop
  } = useQuery(SHOP_QUERY);

  const update = useMutation(UPDATE_SHOP_MUTATION);

  const updateShop = async (data) => {
    mutateShop(data, false);
    await update(data);
  };

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopLoading,
        shopError,
        updateShop,
        fetchShop: mutateShop
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
