import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useOfferAcceptances = (offerId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: offerAcceptances,
    error: offerAcceptancesError,
    mutate: mutateOfferAcceptances
  } = useSWR(
    offerId
      ? `/offers/${offerId}/acceptances?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get,
    { revalidateOnFocus: false }
  );
  const offerAcceptancesLoading = !offerAcceptances && !offerAcceptancesError;

  return {
    offerAcceptances,
    offerAcceptancesLoading,
    offerAcceptancesError,
    fetchOfferAcceptances: mutateOfferAcceptances
  };
};

export default useOfferAcceptances;
