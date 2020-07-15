import useSWR from 'swr';
import { graphqlClient, OFFER_REVENUE_QUERY } from './graphql';

const useOfferRevenue = () => {
  const {
    data: offerRevenue,
    error: offerRevenueError,
    isValidating: offerRevenueValidating
  } = useSWR(OFFER_REVENUE_QUERY, graphqlClient.query);

  const offerRevenueLoading =
    (!offerRevenue && !offerRevenueError) || offerRevenueValidating;

  return { offerRevenue, offerRevenueLoading, offerRevenueError };
};

export default useOfferRevenue;
