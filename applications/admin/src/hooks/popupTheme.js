import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const usePopupTheme = (id) => {
  const { httpClient } = useHttpClient();

  const {
    data: popupTheme,
    error: popupThemeError,
    mutate: fetchPopupTheme
  } = useSWR(
    id ? `/popup-themes/${id}` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const popupThemeLoading = !popupTheme && !popupThemeError;

  return { popupTheme, popupThemeLoading, popupThemeError, fetchPopupTheme };
};

export default usePopupTheme;
