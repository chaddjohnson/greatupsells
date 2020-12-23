import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import {
  useHttpClient,
  useToast
} from '@neatowebsolutions/upselling-react-hooks';

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const { httpClient } = useHttpClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const { data: shop, error: shopError, mutate: mutateShop } = useSWR(
    '/shop',
    httpClient.get,
    { revalidateOnFocus: false }
  );
  const shopLoading = !shop && !shopError;

  const updateShop = async (data) => {
    try {
      mutateShop(data, false);
      await httpClient.put('/shop', data);

      showSuccessToast('Shop saved');
    } catch (error) {
      showErrorToast('Error updating shop');
    }
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
