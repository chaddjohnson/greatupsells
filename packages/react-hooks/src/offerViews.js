import { useQuery } from '@neatowebsolutions/upselling-graphql-client';
import { OFFER_VIEWS_QUERY } from '@neatowebsolutions/upselling-graphql-queries';

const useOfferViews = (offerId, startAt, endAt) => {
  const {
    data: offerViews,
    loading: offerViewsLoading,
    error: offerViewsError,
    mutate: fetchOfferViews
  } = useQuery(OFFER_VIEWS_QUERY, {
    id: offerId,
    startAt: new Date(startAt),
    endAt: new Date(endAt)
  });

  return {
    offerViews,
    offerViewsLoading,
    offerViewsError,
    fetchOfferViews
  };
};

export default useOfferViews;
