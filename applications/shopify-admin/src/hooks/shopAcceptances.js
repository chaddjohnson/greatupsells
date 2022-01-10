import { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useShopAcceptances = (shopId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const [shopAcceptancesLoaded, setShopAcceptancesLoaded] = useState(false);

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: shopAcceptances,
    error: shopAcceptancesError,
    mutate: fetchShopAcceptances
  } = useSWR(
    shopId
      ? `/shop/acceptances?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: true
    }
  );
  const shopAcceptancesLoading = !shopAcceptances && !shopAcceptancesError;

  if (!shopAcceptancesLoaded && !shopAcceptancesLoading) {
    setShopAcceptancesLoaded(true);
  }

  return {
    shopAcceptances,
    shopAcceptancesLoading,
    shopAcceptancesLoaded,
    shopAcceptancesError,
    fetchShopAcceptances
  };
};

export default useShopAcceptances;
