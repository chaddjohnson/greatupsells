import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useOfferConversionRates = (offerId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: offerConversionRates,
    error: offerConversionRatesError,
    mutate: mutateOfferConversionRates
  } = useSWR(
    offerId
      ? `/offers/${offerId}/conversion-rates?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get,
    { revalidateOnFocus: false }
  );
  const offerConversionRatesLoading =
    !offerConversionRates && !offerConversionRatesError;

  return {
    offerConversionRates,
    offerConversionRatesLoading,
    offerConversionRatesError,
    fetchOfferConversionRates: mutateOfferConversionRates
  };
};

export default useOfferConversionRates;
