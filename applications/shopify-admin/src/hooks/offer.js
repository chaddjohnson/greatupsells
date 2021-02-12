import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';
import useToast from './toast';

const useOffer = (offerId) => {
  const { httpClient } = useHttpClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const { data: offer, error: offerError, mutate: mutateOffer } = useSWR(
    offerId ? `/offers/${offerId}` : null,
    httpClient.get.bind(httpClient),
    { revalidateOnFocus: false }
  );
  const offerLoading = !offer && !offerError;

  const createOffer = async (data) => {
    try {
      await httpClient.post(`/offers/${offerId}`, data);

      showSuccessToast('Offer created');
    } catch (error) {
      showErrorToast('Error creating offer');
    }
  };

  const updateOffer = async (data) => {
    try {
      mutateOffer(data, false);
      await httpClient.put(`/offers/${offerId}`, data);
      showSuccessToast('Offer saved');
    } catch (error) {
      showErrorToast('Error saving offer');
    }
  };

  return {
    offer,
    offerLoading,
    offerError,
    createOffer,
    updateOffer,
    fetchOffer: mutateOffer
  };
};

export default useOffer;
