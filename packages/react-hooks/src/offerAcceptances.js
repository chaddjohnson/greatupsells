import useSWR from 'swr';
import { graphqlClient, OFFER_ACCEPTANCES_QUERY } from './graphql';

const useOfferAcceptances = () => {
  const { data: offerAcceptances, error: offerAcceptancesError } = useSWR(
    OFFER_ACCEPTANCES_QUERY,
    graphqlClient.query
  );

  const offerAcceptancesLoading = !offerAcceptances && !offerAcceptancesError;

  return { offerAcceptances, offerAcceptancesLoading, offerAcceptancesError };
};

export default useOfferAcceptances;
