import useSWR from 'swr';
import { graphqlClient, OFFER_VIEWS_QUERY } from './graphql';

const useOfferViews = () => {
  const {
    data: offerViews,
    error: offerViewsError,
    isValidating: offerViewsValidating
  } = useSWR(OFFER_VIEWS_QUERY, graphqlClient.query);

  const offerViewsLoading =
    (!offerViews && !offerViewsError) || offerViewsValidating;

  return { offerViews, offerViewsLoading, offerViewsError };
};

export default useOfferViews;
