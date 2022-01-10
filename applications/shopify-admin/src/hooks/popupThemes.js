import { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const usePopupThemes = () => {
  const { httpClient } = useHttpClient();
  const [popupThemesLoaded, setPopupThemesLoaded] = useState(false);
  const { data: popupThemes, error: popupThemesError } = useSWR(
    '/popup-themes',
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false,
      onSuccess: () => {
        setPopupThemesLoaded(true);
      }
    }
  );
  const popupThemesLoading = !popupThemes && !popupThemesError;

  return {
    popupThemes,
    popupThemesLoading,
    popupThemesLoaded,
    popupThemesError
  };
};

export default usePopupThemes;
