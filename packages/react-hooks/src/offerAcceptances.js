import { useQuery } from '@neatowebsolutions/upselling-graphql-client';
import { OFFER_ACCEPTANCES_QUERY } from '@neatowebsolutions/upselling-graphql-queries';

const useOfferAcceptances = (offerId, startAt, endAt) => {
  const {
    data: offerAcceptances,
    loading: offerAcceptancesLoading,
    error: offerAcceptancesError,
    mutate: fetchOfferAcceptances
  } = useQuery(OFFER_ACCEPTANCES_QUERY, {
    id: offerId,
    startAt: new Date(startAt),
    endAt: new Date(endAt)
  });

  return {
    offerAcceptances,
    offerAcceptancesLoading,
    offerAcceptancesError,
    fetchOfferAcceptances
  };
};

export default useOfferAcceptances;
