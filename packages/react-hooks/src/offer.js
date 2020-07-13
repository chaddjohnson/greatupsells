import useSWR, { mutate } from 'swr';
import {
  graphqlClient,
  OFFER_QUERY,
  NEW_OFFER_QUERY,
  CREATE_OFFER_MUTATION,
  UPDATE_OFFER_MUTATION
} from './graphql';

export const useOffer = (id) => {
  const { data: offer, error: offerError } = useSWR(
    id ? OFFER_QUERY : NEW_OFFER_QUERY,
    (query) => graphqlClient.query(id, query)
  );
  const offerLoading = !offer && !offerError;

  const createOffer = async (data) => {
    await mutate(CREATE_OFFER_MUTATION, (query) =>
      graphqlClient.mutate(query, data)
    );
  };

  const updateOffer = async (data) => {
    await mutate(UPDATE_OFFER_MUTATION, (query) =>
      graphqlClient.mutate(query, data)
    );
    mutate(OFFER_QUERY);
  };

  return { offer, offerLoading, offerError, createOffer, updateOffer };
};
