import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_ACCEPTANCES_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferAcceptances = (offerId, startAt, endAt) => {
  const {
    data: offerAcceptances,
    error: offerAcceptancesError,
    mutate: fetchOfferAcceptances
  } = useSWR([OFFER_ACCEPTANCES_QUERY, offerId], (query, id) =>
    graphqlClient.query(query, {
      id,
      startAt: new Date(startAt),
      endAt: new Date(endAt)
    })
  );

  const offerAcceptancesLoading = !offerAcceptances && !offerAcceptancesError;

  return {
    offerAcceptances,
    offerAcceptancesLoading,
    offerAcceptancesError,
    fetchOfferAcceptances
  };
};

export default useOfferAcceptances;
