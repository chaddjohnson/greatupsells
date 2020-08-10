import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_REVENUE_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferRevenue = (offerId) => {
  const { data: offerRevenue, error: offerRevenueError } = useSWR(
    [OFFER_REVENUE_QUERY, offerId],
    (query, id) => graphqlClient.query(query, { id })
  );

  const offerRevenueLoading = !offerRevenue && !offerRevenueError;

  return { offerRevenue, offerRevenueLoading, offerRevenueError };
};

export default useOfferRevenue;
