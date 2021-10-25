import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useOfferAcceptances = (offerId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: offerAcceptances,
    error: offerAcceptancesError,
    mutate: fetchOfferAcceptances
  } = useSWR(
    offerId
      ? `/offers/${offerId}/acceptances?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    { revalidateOnFocus: true }
  );
  const offerAcceptancesLoading = !offerAcceptances && !offerAcceptancesError;

  return {
    offerAcceptances,
    offerAcceptancesLoading,
    offerAcceptancesError,
    fetchOfferAcceptances
  };
};

export default useOfferAcceptances;
