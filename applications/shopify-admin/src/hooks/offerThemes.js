import { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useOfferThemes = (offerId) => {
  const { httpClient } = useHttpClient();
  const [offerThemesLoaded, setOfferThemesLoaded] = useState(false);
  const { data: offerThemes, error: offerThemesError } = useSWR(
    offerId ? `/offers/${offerId}/themes` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const offerThemesLoading = !offerThemes && !offerThemesError;

  if (!offerThemesLoaded && !offerThemesLoading) {
    setOfferThemesLoaded(true);
  }

  return {
    offerThemes,
    offerThemesLoading,
    offerThemesLoaded,
    offerThemesError
  };
};

export default useOfferThemes;
