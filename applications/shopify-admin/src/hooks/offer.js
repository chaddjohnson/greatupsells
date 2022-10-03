import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';
import useToast from './toast';

const useOffer = (offerId) => {
  const { httpClient } = useHttpClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const [offerLoaded, setOfferLoaded] = useState(false);

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
    const options = {
      optimisticData: { ...offer, enabled: true },
      rollbackOnError: true
    };

    try {
      await mutate(
        url,
        httpClient.put(url, { ...offer, enabled: true }),
        options
      );

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
    const options = {
      optimisticData: { ...offer, enabled: false },
      rollbackOnError: true
    };

    try {
      await mutate(
        url,
        httpClient.put(url, { ...offer, enabled: false }),
        options
      );

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

      // Do not use router.push() because state will be stale.
      window.location.href = `/offers/${duplicatedOffer._id}/`;
    } catch (error) {
      showErrorToast(`Error duplicating offer.`);
      throw error;
    }
  };

  if (!offerLoaded && !offerLoading) {
    setOfferLoaded(true);
  }

  return {
    offer,
    offerLoading,
    offerLoaded,
    offerError,
    saveOffer,
    deleteOffer,
    enableOffer,
    disableOffer,
    duplicateOffer
  };
};

export default useOffer;
