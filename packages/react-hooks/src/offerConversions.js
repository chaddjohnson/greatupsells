import useSWR from 'swr';
import { graphqlClient, OFFER_CONVERSIONS_QUERY } from './graphql';

const useOfferConversions = () => {
  const { data: offerConversions, error: offerConversionsError } = useSWR(
    OFFER_CONVERSIONS_QUERY,
    graphqlClient.query,
    {
      revalidateOnFocus: false
    }
  );

  const offerConversionsLoading = !offerConversions && !offerConversionsError;

  return { offerConversions, offerConversionsLoading, offerConversionsError };
};

export default useOfferConversions;
