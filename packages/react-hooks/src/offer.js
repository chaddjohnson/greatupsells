import useSWR, { mutate } from 'swr';
import {
  graphqlClient,
  OFFER_QUERY,
  CREATE_OFFER_MUTATION,
  UPDATE_OFFER_MUTATION
} from '@neatowebsolutions/upselling-graphql';
import useToast from './toast';

const useOffer = (offerId) => {
  const { showSuccessToast, showErrorToast } = useToast();

  const { data: offer, error: offerError, mutate: fetchOffer } = useSWR(
    offerId ? [OFFER_QUERY, offerId] : null,
    (query, id) => graphqlClient.query(query, { id })
  );
  const offerLoading = !offer && !offerError;

  const createOffer = async (data) => {
    try {
      await mutate(
        CREATE_OFFER_MUTATION,
        graphqlClient.mutate(CREATE_OFFER_MUTATION, data)
      );

      showSuccessToast('Offer created');
    } catch (error) {
      showErrorToast('Error creating offer');
    }
  };

  const updateOffer = async (data) => {
    try {
      const updatedOffer = await mutate(
        UPDATE_OFFER_MUTATION,
        graphqlClient.mutate(UPDATE_OFFER_MUTATION, data)
      );

      await mutate([OFFER_QUERY, offerId], updatedOffer, false);

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
    fetchOffer
  };
};

export default useOffer;
