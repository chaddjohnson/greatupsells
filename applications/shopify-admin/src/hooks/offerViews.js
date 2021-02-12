import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useOfferViews = (offerId, startAt, endAt) => {
  const { httpClient } = useHttpClient();

  const startAtDate = startAt && new Date(startAt).toISOString();
  const endAtDate = endAt && new Date(endAt).toISOString();

  const {
    data: offerViews,
    error: offerViewsError,
    mutate: mutateOfferViews
  } = useSWR(
    offerId
      ? `/offers/${offerId}/views?startAt=${startAtDate}&endAt=${endAtDate}`
      : null,
    httpClient.get.bind(httpClient),
    { revalidateOnFocus: false }
  );
  const offerViewsLoading = !offerViews && !offerViewsError;

  return {
    offerViews,
    offerViewsLoading,
    offerViewsError,
    fetchOfferViews: mutateOfferViews
  };
};

export default useOfferViews;
