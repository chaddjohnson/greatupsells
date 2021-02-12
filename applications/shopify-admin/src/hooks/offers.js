import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useOffers = () => {
  const { httpClient } = useHttpClient();

  const { data: offers, error: offersError, mutate: fetchOffers } = useSWR(
    `/offers`,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const offersLoading = !offers && !offersError;

  return { offers, offersLoading, offersError, fetchOffers };
};

export default useOffers;
