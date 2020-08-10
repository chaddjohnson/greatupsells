import useSWR from 'swr';
import {
  graphqlClient,
  OFFER_CONVERSIONS_QUERY
} from '@neatowebsolutions/upselling-graphql';

const useOfferConversions = (offerId) => {
  const { data: offerConversions, error: offerConversionsError } = useSWR(
    [OFFER_CONVERSIONS_QUERY, offerId],
    (query, id) => graphqlClient.query(query, { id })
  );

  const offerConversionsLoading = !offerConversions && !offerConversionsError;

  return { offerConversions, offerConversionsLoading, offerConversionsError };
};

export default useOfferConversions;
