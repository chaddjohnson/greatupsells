import { useQuery } from '@neatowebsolutions/upselling-graphql-client';
import { OFFERS_QUERY } from '@neatowebsolutions/upselling-graphql-queries';

const useOffers = () => {
  const {
    data: offers,
    loading: offersLoading,
    error: offersError,
    mutate: fetchOffers
  } = useQuery(OFFERS_QUERY, null, {
    refreshInterval: 10 * 1000
  });

  return { offers, offersLoading, offersError, fetchOffers };
};

export default useOffers;
