import useSWR from 'swr';
import { useHttpClient } from '@greatupsellsreact-hooks';

const useOfferRevenueIncreases = (offerId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: offerRevenueIncreases,
    error: offerRevenueIncreasesError,
    mutate: fetchOfferRevenueIncreases
  } = useSWR(
    offerId
      ? `/offers/${offerId}/revenue-increases?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    { revalidateOnFocus: true }
  );
  const offerRevenueIncreasesLoading =
    !offerRevenueIncreases && !offerRevenueIncreasesError;

  return {
    offerRevenueIncreases,
    offerRevenueIncreasesLoading,
    offerRevenueIncreasesError,
    fetchOfferRevenueIncreases
  };
};

export default useOfferRevenueIncreases;
