import { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useOfferPopupThemes = (offerId) => {
  const { httpClient } = useHttpClient();
  const [offerPopupThemesLoaded, setOfferPopupThemesLoaded] = useState(false);
  const { data: offerPopupThemes, error: offerPopupThemesError } = useSWR(
    offerId ? `/offers/${offerId}/popup-themes` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false,
      onSuccess: () => {
        setOfferPopupThemesLoaded(true);
      }
    }
  );
  const offerPopupThemesLoading = !offerPopupThemes && !offerPopupThemesError;

  return {
    offerPopupThemes,
    offerPopupThemesLoading,
    offerPopupThemesLoaded,
    offerPopupThemesError
  };
};

export default useOfferPopupThemes;
