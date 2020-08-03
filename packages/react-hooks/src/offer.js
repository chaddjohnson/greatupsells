import useSWR, { mutate } from 'swr';
import {
  graphqlClient,
  OFFER_QUERY,
  CREATE_OFFER_MUTATION,
  UPDATE_OFFER_MUTATION
} from './graphql';

const useOffer = (id) => {
  const { data: offer, error: offerError } = useSWR(
    id ? OFFER_QUERY : null,
    graphqlClient.query,
    { revalidateOnFocus: false }
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

  return { offer, offerLoading, offerError, createOffer, updateOffer };
};

export default useOffer;
