import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useOfferConversions = (offerId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: offerConversions,
    error: offerConversionsError,
    mutate: fetchOfferConversions
  } = useSWR(
    offerId
      ? `/offers/${offerId}/conversions?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    { revalidateOnFocus: true }
  );
  const offerConversionsLoading = !offerConversions && !offerConversionsError;

  return {
    offerConversions,
    offerConversionsLoading,
    offerConversionsError,
    fetchOfferConversions
  };
};

export default useOfferConversions;
