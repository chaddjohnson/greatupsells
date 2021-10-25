import useSWR from 'swr';
import { useHttpClient } from '@greatupsellsreact-hooks';

const useOffers = () => {
  const { httpClient } = useHttpClient();
  const { data: offers, error: offersError } = useSWR(
    `/offers`,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const offersLoading = !offers && !offersError;

  return { offers, offersLoading, offersError };
};

export default useOffers;
