import useSWR from 'swr';
import { useHttpClient } from '@greatupsellsreact-hooks';

const usePopupThemes = () => {
  const { httpClient } = useHttpClient();
  const { data: popupThemes, error: popupThemesError } = useSWR(
    '/popup-themes',
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const popupThemesLoading = !popupThemes && !popupThemesError;

  return {
    popupThemes,
    popupThemesLoading,
    popupThemesError
  };
};

export default usePopupThemes;
