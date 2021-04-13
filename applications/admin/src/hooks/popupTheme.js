import useSWR, { mutate } from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';
import { useToast } from './toast';

const usePopupTheme = (id) => {
  const { httpClient } = useHttpClient();
  const { showSuccessToast, showErrorToast } = useToast();

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

    try {
      if (values._id) {
        await mutate(url, httpClient.put(url, values));
      } else {
        // Use a different key than the URL here to avoid a cache conflict with GET /popup-themes.
        await mutate('new-popup-theme', httpClient.post(url, values));
      }

      showSuccessToast('Popup theme saved successfully.');
    } catch (error) {
      showErrorToast('Error saving popup theme.');
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
