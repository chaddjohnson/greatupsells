import { useState } from 'react';
import useSWR from 'swr';
import qs from 'querystringify';
import { useHttpClient } from '@greatupsells/react-hooks';

const useOffers = (filters) => {
  const { httpClient } = useHttpClient();
  const [offersLoaded, setOffersLoaded] = useState(false);
  const { data: offers, error: offersError } = useSWR(
    `/offers${qs.stringify(filters, true)}`,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false,
      onSuccess: () => {
        setOffersLoaded(true);
      }
    }
  );
  const offersLoading = !offers && !offersError;

  return { offers, offersLoading, offersLoaded, offersError };
};

export default useOffers;
