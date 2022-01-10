import { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useShopConversions = (shopId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const [shopConversionsLoaded, setShopConversionsLoaded] = useState(false);

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: shopConversions,
    error: shopConversionsError,
    mutate: fetchShopConversions
  } = useSWR(
    shopId
      ? `/shop/conversions?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: true,
      onSuccess: () => {
        setShopConversionsLoaded(true);
      }
    }
  );
  const shopConversionsLoading = !shopConversions && !shopConversionsError;

  return {
    shopConversions,
    shopConversionsLoading,
    shopConversionsLoaded,
    shopConversionsError,
    fetchShopConversions
  };
};

export default useShopConversions;
