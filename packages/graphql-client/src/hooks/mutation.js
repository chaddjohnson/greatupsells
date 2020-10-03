import { useContext } from 'react';
import { mutate } from 'swr';
import GraphQLContext from '../context';

const useMutation = (query) => {
  const { client } = useContext(GraphQLContext);

  // Return a callable function.
  return async (data = {}) => {
    return mutate(query, client.mutate(query, data));
  };
};

export default useMutation;
