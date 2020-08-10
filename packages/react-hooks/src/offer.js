import useSWR, { mutate } from 'swr';
import {
  graphqlClient,
  OFFER_QUERY,
  CREATE_OFFER_MUTATION,
  UPDATE_OFFER_MUTATION
} from '@neatowebsolutions/upselling-graphql';

const useOffer = (id) => {
  const { data: offer, error: offerError, mutate: fetchOffer } = useSWR(
    id ? OFFER_QUERY : null,
    (query) => graphqlClient.query(query, { id })
  );
  const offerLoading = !offer && !offerError;

  const createOffer = async (data) => {
    await mutate(
      CREATE_OFFER_MUTATION,
      graphqlClient.mutate(CREATE_OFFER_MUTATION, data)
    );
  };

  const updateOffer = async (data) => {
    await mutate(
      UPDATE_OFFER_MUTATION,
      graphqlClient.mutate(UPDATE_OFFER_MUTATION, data)
    );
    await mutate(OFFER_QUERY);
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
