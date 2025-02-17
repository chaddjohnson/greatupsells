import React, { useState } from 'react';
import useSWR from 'swr';
import { useCache, useHttpClient } from '@greatupsells/react-hooks';

const useShop = () => {
  const { httpClient } = useHttpClient();
  const { getCache, setCache } = useCache();
  const [shopLoaded, setShopLoaded] = useState(false);

  // Use local caching to reduce cost. We do not rely on 304 responses from the API
  // because these requests still trigger API handlers to run.
  const { data: shop, error: shopError } = useSWR(
    '/shop',
    async () => {
      const cachedShop = getCache('shop');

      if (cachedShop) {
        return cachedShop;
      }

      const currentShop = await httpClient.get('/shop');
      const cacheExpiresAt = new Date().getTime() + 1000 * 60 * 5;

      setCache('shop', currentShop, cacheExpiresAt);

      return currentShop;
    },
    {
      revalidateOnFocus: false
    }
  );
  const shopLoading = !shop && !shopError;

  if (!shopLoaded && !shopLoading) {
    setShopLoaded(true);
  }

  return { shop, shopError, shopLoading, shopLoaded };
};

export default useShop;
