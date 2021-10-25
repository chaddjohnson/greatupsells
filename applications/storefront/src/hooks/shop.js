import React from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsellsreact-hooks';

const useShop = () => {
  const { httpClient } = useHttpClient();

  const { data: shop, error: shopError } = useSWR(
    '/shop',
    httpClient.get.bind(httpClient),
    { revalidateOnFocus: false }
  );
  const shopLoading = !shop && !shopError;

  return { shop, shopError, shopLoading };
};

export default useShop;
