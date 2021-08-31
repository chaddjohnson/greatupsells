import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';
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

    try {
      if (isNew) {
        // Use a different key than the URL here to avoid a cache conflict with GET /popup-themes.
        updatedData = await httpClient.post(url, data);
        showSuccessToast('Offer created.');
      } else {
        updatedData = await mutate(url, httpClient.put(url, data));
        showSuccessToast('Offer updated.');
      }

      return updatedData;
    } catch (error) {
      showErrorToast(`Error ${isNew ? 'creating' : 'updating'} offer.`);
    }
  };

  const enableOffer = async () => {
    if (!offerId) {
      return;
    }

    await httpClient.put(`/offers/${offerId}`, {
      ...offer,
      enabled: true
    });

    mutate(`/offers/${offerId}`, { ...offer, enabled: true }, false);
  };

  const disableOffer = async () => {
    if (!offerId) {
      return;
    }

    await httpClient.put(`/offers/${offerId}`, {
      ...offer,
      enabled: false
    });

    mutate(`/offers/${offerId}`, { ...offer, enabled: false }, false);
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
    }
  };

  return {
    offer,
    offerLoading,
    offerError,
    saveOffer,
    enableOffer,
    disableOffer,
    duplicateOffer
  };
};

export default useOffer;
