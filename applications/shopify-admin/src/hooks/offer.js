import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { useHttpClient } from '@neatowebsolutions/greatupsells-react-hooks';
import useToast from './toast';

const useOffer = (offerId) => {
  const router = useRouter();
  const { httpClient } = useHttpClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const { data: offer, error: offerError } = useSWR(
    offerId ? `/offers/${offerId}` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const offerLoading = !offer && !offerError;

  const saveOffer = async (data) => {
    const isNew = !data._id;
    const url = isNew ? '/offers' : `/offers/${data._id}`;
    let updatedData = null;

    if (isNew) {
      // Use a different key than the URL here to avoid a cache conflict with GET /popup-themes.
      updatedData = await httpClient.post(url, data);
    } else {
      updatedData = await mutate(url, httpClient.put(url, data));
    }

    return updatedData;
  };

  const deleteOffer = async () => {
    if (!offerId) {
      return;
    }

    try {
      await httpClient.delete(`/offers/${offerId}`);
      showSuccessToast('Offer deleted.');
    } catch (error) {
      showErrorToast(`Error deleting offer.`);
      throw error;
    }
  };

  const enableOffer = async () => {
    if (!offerId) {
      return;
    }

    const url = `/offers/${offerId}`;

    try {
      await mutate(url, httpClient.put(url, { ...offer, enabled: true }));

      showSuccessToast('Offer enabled.');
    } catch (error) {
      showErrorToast('Error enabling offer');
      throw error;
    }
  };

  const disableOffer = async () => {
    if (!offerId) {
      return;
    }

    const url = `/offers/${offerId}`;

    try {
      await mutate(url, httpClient.put(url, { ...offer, enabled: false }));

      showSuccessToast('Offer disabled.');
    } catch (error) {
      showErrorToast('Error disabling offer.');
      throw error;
    }
  };

  const duplicateOffer = async () => {
    if (!offerId) {
      return;
    }

    try {
      const duplicatedOffer = await httpClient.post(`/offers/${offerId}/clone`);

      showSuccessToast('Offer duplicated.');

      router.push(`/offers/${duplicatedOffer._id}/`);
    } catch (error) {
      showErrorToast(`Error duplicating offer.`);
      throw error;
    }
  };

  return {
    offer,
    offerLoading,
    offerError,
    saveOffer,
    deleteOffer,
    enableOffer,
    disableOffer,
    duplicateOffer
  };
};

export default useOffer;
