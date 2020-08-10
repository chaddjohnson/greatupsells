import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_CONVERSIONS_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferConversions = () => {
  const { data: offerConversions, error: offerConversionsError } = useSWR(
    OFFER_CONVERSIONS_QUERY,
    graphqlClient.query
  );

  const offerConversionsLoading = !offerConversions && !offerConversionsError;

  return { offerConversions, offerConversionsLoading, offerConversionsError };
};

export default useOfferConversions;
