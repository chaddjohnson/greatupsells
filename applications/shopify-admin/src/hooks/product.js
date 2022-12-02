import { useHttpClient } from '@greatupsells/react-hooks';

const useProduct = () => {
  const { httpClient } = useHttpClient();

  const fetchRandomProduct = async () => {
    return httpClient.get('/products/random');
  };

  return { fetchRandomProduct };
};

export default useProduct;
