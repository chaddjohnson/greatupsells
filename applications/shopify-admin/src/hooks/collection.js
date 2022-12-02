import { useHttpClient } from '@greatupsells/react-hooks';

const useCollection = () => {
  const { httpClient } = useHttpClient();

  const fetchRandomCollection = async () => {
    return httpClient.get('/collections/random');
  };

  return { fetchRandomCollection };
};

export default useCollection;
