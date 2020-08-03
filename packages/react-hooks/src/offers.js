import useSWR from 'swr';
import { graphqlClient, OFFERS_QUERY } from './graphql';

const useOffers = () => {
  const { data: offers, error: offersError } = useSWR(
    OFFERS_QUERY,
    graphqlClient.query,
    { revalidateOnFocus: false }
  );

  const offersLoading = !offers && !offersError;

  return { offers, offersLoading, offersError };
};

export default useOffers;
