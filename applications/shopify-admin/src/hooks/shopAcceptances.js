import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useShopAcceptances = (shopId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

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

  return {
    shopAcceptances,
    shopAcceptancesLoading,
    shopAcceptancesError,
    fetchShopAcceptances
  };
};

export default useShopAcceptances;
