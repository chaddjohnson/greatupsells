import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useShopImpressions = (shopId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: shopImpressions,
    error: shopImpressionsError,
    mutate: fetchShopImpressions
  } = useSWR(
    shopId
      ? `/shop/impressions?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: true
    }
  );
  const shopImpressionsLoading = !shopImpressions && !shopImpressionsError;

  return {
    shopImpressions,
    shopImpressionsLoading,
    shopImpressionsError,
    fetchShopImpressions
  };
};

export default useShopImpressions;
