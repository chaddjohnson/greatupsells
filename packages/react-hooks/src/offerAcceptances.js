import useSWR from 'swr';
import { graphqlClient, OFFER_ACCEPTANCES_QUERY } from './graphql';

const useOfferAcceptances = () => {
  const {
    data: offerAcceptances,
    error: offerAcceptancesError,
    isValidating: offerAcceptancesValidating
  } = useSWR(OFFER_ACCEPTANCES_QUERY, graphqlClient.query);

  const offerAcceptancesLoading =
    (!offerAcceptances && !offerAcceptancesError) || offerAcceptancesValidating;

  return { offerAcceptances, offerAcceptancesLoading, offerAcceptancesError };
};

export default useOfferAcceptances;
