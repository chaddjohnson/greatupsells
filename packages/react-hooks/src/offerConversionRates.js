import { useQuery } from '@neatowebsolutions/upselling-graphql-client';
import { OFFER_CONVERSION_RATES_QUERY } from '@neatowebsolutions/upselling-graphql-queries';

const useOfferConversionRates = (offerId, startAt, endAt) => {
  const {
    data: offerConversionRates,
    loading: offerConversionRatesLoading,
    error: offerConversionRatesError,
    mutate: mutateOfferConversionRates
  } = useQuery(OFFER_CONVERSION_RATES_QUERY, {
    id: offerId,
    startAt: new Date(startAt),
    endAt: new Date(endAt)
  });

  return {
    offerConversionRates,
    offerConversionRatesLoading,
    offerConversionRatesError,
    fetchOfferConversionRates: mutateOfferConversionRates
  };
};

export default useOfferConversionRates;
