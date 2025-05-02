import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import useSWR, { mutate } from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';
import useToast from './toast';

const ShopContext = createContext(null);

const ShopProvider = ({ children }) => {
  const { httpClient } = useHttpClient();
  const [shopLoaded, setShopLoaded] = useState(false);

  const {
    data: shop,
    error: shopError,
    mutate: fetchShop
  } = useSWR('/shop', httpClient.get.bind(httpClient), {
    revalidateOnFocus: true
  });
  const shopLoading = !shop && !shopError;

  const changePlan = () => {
    window.top.location.href = `https://apps.shopify.com/great-upsells/plans?shop=${shop?.domain}`;
  };

  if (!shopLoaded && !shopLoading) {
    setShopLoaded(true);
  }

  if (!shopLoaded) {
    return null;
  }

  return (
    <ShopContext.Provider
      value={{
        shop,
        shopLoading,
        shopLoaded,
        shopError,
        fetchShop,
        changePlan
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
