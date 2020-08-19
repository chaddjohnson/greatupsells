import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_CONVERSIONS_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferConversions = (offerId, startAt, endAt) => {
  const {
    data: offerConversions,
    error: offerConversionsError,
    mutate: fetchOfferConversions
  } = useSWR([OFFER_CONVERSIONS_QUERY, offerId], (query, id) =>
    graphqlClient.query(query, {
      id,
      startAt: new Date(startAt),
      endAt: new Date(endAt)
    })
  );

  const offerConversionsLoading = !offerConversions && !offerConversionsError;

  return {
    offerConversions,
    offerConversionsLoading,
    offerConversionsError,
    fetchOfferConversions
  };
};

export default useOfferConversions;
