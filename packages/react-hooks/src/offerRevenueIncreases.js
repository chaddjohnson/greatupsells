import { useQuery } from '@neatowebsolutions/upselling-graphql-client';
import { OFFER_REVENUE_INCREASES_QUERY } from '@neatowebsolutions/upselling-graphql-queries';

const useOfferRevenueIncreases = (offerId, startAt, endAt) => {
  const {
    data: offerRevenueIncreases,
    loading: offerRevenueIncreasesLoading,
    error: offerRevenueIncreasesError,
    mutate: fetchOfferRevenueIncreases
  } = useQuery(OFFER_REVENUE_INCREASES_QUERY, {
    id: offerId,
    startAt: new Date(startAt),
    endAt: new Date(endAt)
  });

  return {
    offerRevenueIncreases,
    offerRevenueIncreasesLoading,
    offerRevenueIncreasesError,
    fetchOfferRevenueIncreases
  };
};

export default useOfferRevenueIncreases;
