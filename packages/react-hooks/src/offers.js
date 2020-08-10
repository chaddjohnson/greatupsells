import useSWR from 'swr';
import {
  graphqlClient,
  OFFERS_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOffers = () => {
  const {
    data: offers,
    error: offersError,
    mutate: fetchOffers
  } = useSWR(OFFERS_QUERY, graphqlClient.query, { refreshInterval: 10 * 1000 });

  const offersLoading = !offers && !offersError;

  return { offers, offersLoading, offersError, fetchOffers };
};

export default useOffers;
