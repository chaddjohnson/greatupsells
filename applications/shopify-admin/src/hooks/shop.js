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
      revalidateOnFocus: true
    }
  );
  const shopLoading = !shop && !shopError;

  const changePlan = async (level) => {
    const url = '/plan';
    const data = { level };

    try {
      const { redirectUrl } = await mutate(url, httpClient.post(url, data));

      window.top.location.href = redirectUrl;
    } catch (error) {
      showErrorToast('Error changing plan.');
      throw error;
    }
  };

  const activatePlan = async () => {
    const url = '/plan/activation';

    try {
      await mutate(url, httpClient.post(url));
      await fetchShop();
      showSuccessToast('Plan activated.');
    } catch (error) {
      showErrorToast('Error activating plan.');
      throw error;
    }
  };

  if (!shopLoaded && !shopLoading) {
    setShopLoaded(true);
  }

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopLoading,
        shopLoaded,
        shopError,
        fetchShop,
        changePlan,
        activatePlan
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
