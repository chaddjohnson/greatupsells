import useSWR from 'swr';
import { useHttpClient } from '@greatupsellsreact-hooks';

const useOfferPopupThemes = (offerId) => {
  const { httpClient } = useHttpClient();
  const { data: offerPopupThemes, error: offerPopupThemesError } = useSWR(
    offerId ? `/offers/${offerId}/popup-themes` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const offerPopupThemesLoading = !offerPopupThemes && !offerPopupThemesError;

  return {
    offerPopupThemes,
    offerPopupThemesLoading,
    offerPopupThemesError
  };
};

export default useOfferPopupThemes;
