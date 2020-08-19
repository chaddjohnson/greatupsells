import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_CONVERSION_RATES_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferConversionRates = (offerId, startAt, endAt) => {
  const {
    data: offerConversionRates,
    error: offerConversionRatesError,
    mutate: fetchOfferConversionRates
  } = useSWR([OFFER_CONVERSION_RATES_QUERY, offerId], (query, id) =>
    graphqlClient.query(query, {
      id,
      startAt: new Date(startAt),
      endAt: new Date(endAt)
    })
  );

  const offerConversionRatesLoading =
    !offerConversionRates && !offerConversionRatesError;

  return {
    offerConversionRates,
    offerConversionRatesLoading,
    offerConversionRatesError,
    fetchOfferConversionRates
  };
};

export default useOfferConversionRates;
