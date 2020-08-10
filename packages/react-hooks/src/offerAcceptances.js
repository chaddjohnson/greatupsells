import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_ACCEPTANCES_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferAcceptances = (offerId) => {
  const { data: offerAcceptances, error: offerAcceptancesError } = useSWR(
    [OFFER_ACCEPTANCES_QUERY, offerId],
    (query, id) => graphqlClient.query(query, { id })
  );

  const offerAcceptancesLoading = !offerAcceptances && !offerAcceptancesError;

  return { offerAcceptances, offerAcceptancesLoading, offerAcceptancesError };
};

export default useOfferAcceptances;
