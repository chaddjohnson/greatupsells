import useSWR from 'swr';
import { graphqlClient, OFFER_REVENUE_QUERY } from './graphql';

const useOfferRevenue = () => {
  const { data: offerRevenue, error: offerRevenueError } = useSWR(
    OFFER_REVENUE_QUERY,
    graphqlClient.query,
    {
      revalidateOnFocus: false
    }
  );

  const offerRevenueLoading = !offerRevenue && !offerRevenueError;

  return { offerRevenue, offerRevenueLoading, offerRevenueError };
};

export default useOfferRevenue;
