import React, { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useShop = () => {
  const { httpClient } = useHttpClient();

  const [shopLoaded, setShopLoaded] = useState(false);

  const { data: shop, error: shopError } = useSWR(
    '/shop',
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false,
      onSuccess: () => {
        setShopLoaded(true);
      }
    }
  );
  const shopLoading = !shop && !shopError;

  return { shop, shopError, shopLoading, shopLoaded };
};

export default useShop;
