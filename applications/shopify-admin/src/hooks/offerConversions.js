import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useOfferConversions = (offerId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: offerConversions,
    error: offerConversionsError,
    mutate: mutateOfferConversions
  } = useSWR(
    offerId
      ? `/offers/${offerId}/conversions?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get,
    { revalidateOnFocus: false }
  );
  const offerConversionsLoading = !offerConversions && !offerConversionsError;

  return {
    offerConversions,
    offerConversionsLoading,
    offerConversionsError,
    fetchOfferConversions: mutateOfferConversions
  };
};

export default useOfferConversions;
