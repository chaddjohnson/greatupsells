import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_REVENUE_INCREASES_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferRevenueIncreases = (offerId, startAt, endAt) => {
  const {
    data: offerRevenueIncreases,
    error: offerRevenueIncreasesError,
    mutate: fetchOfferRevenueIncreases
  } = useSWR([OFFER_REVENUE_INCREASES_QUERY, offerId], (query, id) =>
    graphqlClient.query(query, {
      id,
      startAt: new Date(startAt),
      endAt: new Date(endAt)
    })
  );

  const offerRevenueIncreasesLoading =
    !offerRevenueIncreases && !offerRevenueIncreasesError;

  return {
    offerRevenueIncreases,
    offerRevenueIncreasesLoading,
    offerRevenueIncreasesError,
    fetchOfferRevenueIncreases
  };
};

export default useOfferRevenueIncreases;
