import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import useSWR, { mutate } from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';
import useToast from './toast';

const ShopContext = createContext(null);

const ShopProvider = ({ children }) => {
  const { httpClient } = useHttpClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const [shopLoaded, setShopLoaded] = useState(false);

  const { data: shop, error: shopError, mutate: fetchShop } = useSWR(
    '/shop',
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: true,
      onSuccess: () => {
        setShopLoaded(true);
      }
    }
  );
  const shopLoading = !shop && !shopError;

  const saveShop = async (data) => {
    const url = '/shop';
    let updatedData = null;

    try {
      updatedData = await mutate(url, httpClient.put(url, data));
      showSuccessToast('Shop updated.');

      return updatedData;
    } catch (error) {
      showErrorToast('Error updating shop.');
      throw error;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopLoading,
        shopLoaded,
        shopError,
        fetchShop,
        saveShop
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

ShopProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useShop = () => useContext(ShopContext);

export { ShopProvider, useShop };
