import useSWR, { mutate } from 'swr';
import {
  graphqlClient,
  OFFER_QUERY,
  CREATE_OFFER_MUTATION,
  UPDATE_OFFER_MUTATION
} from '@neatowebsolutions/upselling-graphql';

const useOffer = (offerId) => {
  const { data: offer, error: offerError, mutate: fetchOffer } = useSWR(
    offerId ? [OFFER_QUERY, offerId] : null,
    (query, id) => graphqlClient.query(query, { id })
  );
  const offerLoading = !offer && !offerError;

  const createOffer = async (data) => {
    await mutate(
      CREATE_OFFER_MUTATION,
      graphqlClient.mutate(CREATE_OFFER_MUTATION, data)
    );
  };

  const updateOffer = async (data) => {
    const updatedOffer = await mutate(
      UPDATE_OFFER_MUTATION,
      graphqlClient.mutate(UPDATE_OFFER_MUTATION, data)
    );
    await mutate([OFFER_QUERY, offerId], updatedOffer, false);
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
