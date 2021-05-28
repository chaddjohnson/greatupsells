import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useShopRevenueIncreases = (shopId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: shopRevenueIncreases,
    error: shopRevenueIncreasesError,
    mutate: fetchShopRevenueIncreases
  } = useSWR(
    shopId
      ? `/shop/revenue-increases?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: true
    }
  );
  const shopRevenueIncreasesLoading =
    !shopRevenueIncreases && !shopRevenueIncreasesError;

  return {
    shopRevenueIncreases,
    shopRevenueIncreasesLoading,
    shopRevenueIncreasesError,
    fetchShopRevenueIncreases
  };
};

export default useShopRevenueIncreases;
