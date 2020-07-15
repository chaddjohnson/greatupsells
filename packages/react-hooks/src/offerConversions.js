import useSWR from 'swr';
import { graphqlClient, OFFER_CONVERSIONS_QUERY } from './graphql';

const useOfferConversions = () => {
  const {
    data: offerConversions,
    error: offerConversionsError,
    isValidating: offerConversionsValidating
  } = useSWR(OFFER_CONVERSIONS_QUERY, graphqlClient.query);

  const offerConversionsLoading =
    (!offerConversions && !offerConversionsError) || offerConversionsValidating;

  return { offerConversions, offerConversionsLoading, offerConversionsError };
};

export default useOfferConversions;
