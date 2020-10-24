import { useContext } from 'react';
import useSWR from 'swr';
import GraphQLContext from '../context';

const useQuery = (query, variables = {}, options = {}) => {
  const { client } = useContext(GraphQLContext);

  const variableValues = Object.values(variables || {});

  const { data, error, mutate } = useSWR(
    query ? [query, ...variableValues] : null,
    () => client.query(query, variables),
    options
  );
  const loading = !data && !error;

  return { data, loading, error, mutate };
};

export default useQuery;
