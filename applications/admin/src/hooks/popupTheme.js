import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';
import { useToast } from './toast';

const usePopupTheme = (id) => {
  const { httpClient } = useHttpClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const [popupThemeLoaded, setPopupThemeLoaded] = useState(false);

  const { data: popupTheme, error: popupThemeError } = useSWR(
    id ? `/popup-themes/${id}` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false,
      onSuccess: () => {
        setPopupThemeLoaded(true);
      }
    }
  );
  const popupThemeLoading = !popupTheme && !popupThemeError;

  const savePopupTheme = async (data) => {
    const isNew = !data._id;
    const url = isNew ? '/popup-themes' : `/popup-themes/${data._id}`;
    let updatedData = null;

    try {
      if (isNew) {
        // Use a different key than the URL here to avoid a cache conflict with GET /popup-themes.
        updatedData = await httpClient.post(url, data);
      } else {
        updatedData = await mutate(url, httpClient.put(url, data));
      }

      showSuccessToast('Popup theme saved successfully.');

      return updatedData;
    } catch (error) {
      showErrorToast('Error saving popup theme.');
      throw error;
    }
  };

  const clonePopupTheme = async (sourcePopupTheme) => {
    try {
      const clonedPopupTheme = await httpClient.post(
        `/popup-themes/${sourcePopupTheme._id}/clone`
      );

      showSuccessToast(`Popup theme cloned successfully.`);

      return clonedPopupTheme;
    } catch (error) {
      showErrorToast('Error cloning popup theme.');
      throw error;
    }
  };

  return {
    popupTheme,
    popupThemeLoading,
    popupThemeLoaded,
    popupThemeError,
    savePopupTheme,
    clonePopupTheme
  };
};

export default usePopupTheme;
