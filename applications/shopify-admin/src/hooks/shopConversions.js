import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useShopConversions = (shopId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

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
      revalidateOnFocus: true
    }
  );
  const shopConversionsLoading = !shopConversions && !shopConversionsError;

  return {
    shopConversions,
    shopConversionsLoading,
    shopConversionsError,
    fetchShopConversions
  };
};

export default useShopConversions;
