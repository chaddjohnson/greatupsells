import { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useOfferImpressions = (offerId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const [offerImpressionsLoaded, setOfferImpressionsLoaded] = useState(false);

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: offerImpressions,
    error: offerImpressionsError,
    mutate: fetchOfferImpressions
  } = useSWR(
    offerId
      ? `/offers/${offerId}/impressions?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: true,
      onSuccess: () => {
        setOfferImpressionsLoaded(true);
      }
    }
  );
  const offerImpressionsLoading = !offerImpressions && !offerImpressionsError;

  return {
    offerImpressions,
    offerImpressionsLoading,
    offerImpressionsLoaded,
    offerImpressionsError,
    fetchOfferImpressions
  };
};

export default useOfferImpressions;
