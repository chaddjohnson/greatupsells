import useSWR, { mutate } from 'swr';
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

  const savePopupTheme = async (values) => {
    const url = values._id ? `/popup-themes/${values._id}` : '/popup-themes';

    if (values._id) {
      await mutate(url, httpClient.put(url, values));
    } else {
      await mutate(url, httpClient.post(url, values));
    }
  };

  return {
    popupTheme,
    popupThemeLoading,
    popupThemeError,
    fetchPopupTheme,
    savePopupTheme
  };
};

export default usePopupTheme;
