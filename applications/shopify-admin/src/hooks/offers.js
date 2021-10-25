import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/greatupsells-react-hooks';

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
