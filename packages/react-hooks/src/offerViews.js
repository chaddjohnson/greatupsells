import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_VIEWS_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferViews = (offerId) => {
  const { data: offerViews, error: offerViewsError } = useSWR(
    [OFFER_VIEWS_QUERY, offerId],
    (query, id) => graphqlClient.query(query, { id })
  );

  const offerViewsLoading = !offerViews && !offerViewsError;

  return { offerViews, offerViewsLoading, offerViewsError };
};

export default useOfferViews;
