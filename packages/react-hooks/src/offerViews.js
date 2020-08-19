import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_VIEWS_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferViews = (offerId, startAt, endAt) => {
  const {
    data: offerViews,
    error: offerViewsError,
    mutate: fetchOfferViews
  } = useSWR([OFFER_VIEWS_QUERY, offerId], (query, id) =>
    graphqlClient.query(query, {
      id,
      startAt: new Date(startAt),
      endAt: new Date(endAt)
    })
  );

  const offerViewsLoading = !offerViews && !offerViewsError;

  return {
    offerViews,
    offerViewsLoading,
    offerViewsError,
    fetchOfferViews
  };
};

export default useOfferViews;
