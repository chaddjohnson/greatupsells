import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const usePopupThemes = () => {
  const { httpClient } = useHttpClient();

  const {
    data: popupThemes,
    error: popupThemesError,
    mutate: fetchPopupThemes
  } = useSWR(`/popup-themes`, httpClient.get.bind(httpClient), {
    revalidateOnFocus: false
  });
  const popupThemesLoading = !popupThemes && !popupThemesError;

  return {
    popupThemes,
    popupThemesLoading,
    popupThemesError,
    fetchPopupThemes
  };
};

export default usePopupThemes;
