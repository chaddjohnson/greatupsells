import { useQuery } from '@neatowebsolutions/upselling-graphql-client';
import { OFFER_CONVERSIONS_QUERY } from '@neatowebsolutions/upselling-graphql-queries';

const useOfferConversions = (offerId, startAt, endAt) => {
  const {
    data: offerConversions,
    loading: offerConversionsLoading,
    error: offerConversionsError,
    mutate: mutateOfferConversions
  } = useQuery(OFFER_CONVERSIONS_QUERY, {
    id: offerId,
    startAt: new Date(startAt),
    endAt: new Date(endAt)
  });

  return {
    offerConversions,
    offerConversionsLoading,
    offerConversionsError,
    fetchOfferConversions: mutateOfferConversions
  };
};

export default useOfferConversions;
