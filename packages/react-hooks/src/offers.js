import useSWR from 'swr';
import { graphqlClient, OFFERS_QUERY } from './graphql';

const useOffers = () => {
  const {
    data: offers,
    error: offersError,
    isValidating: offersValidating
  } = useSWR(OFFERS_QUERY, graphqlClient.query);

  const offersLoading = (!offers && !offersError) || offersValidating;

  return { offers, offersLoading, offersError };
};

export default useOffers;
