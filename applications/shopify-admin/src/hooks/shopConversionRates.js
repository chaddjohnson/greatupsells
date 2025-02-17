import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useShopConversionRates = (shopId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: shopConversionRates,
    error: shopConversionRatesError,
    mutate: fetchShopConversionRates
  } = useSWR(
    shopId ? `/shop/conversion-rates?startAt=${startAtDate}&endAt=${endAtDate}` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: true
    }
  );
  const shopConversionRatesLoading = !shopConversionRates && !shopConversionRatesError;

  return {
    shopConversionRates,
    shopConversionRatesLoading,
    shopConversionRatesError,
    fetchShopConversionRates
  };
};

export default useShopConversionRates;
