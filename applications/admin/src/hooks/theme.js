import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';
import { useToast } from './toast';

const useTheme = (id) => {
  const { httpClient } = useHttpClient();
  const { showSuccessToast, showErrorToast } = useToast();

  const [themeLoaded, setThemeLoaded] = useState(false);

  const { data: theme, error: themeError } = useSWR(
    id ? `/themes/${id}` : null,
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const themeLoading = !theme && !themeError;

  const saveTheme = async (data) => {
    const isNew = !data._id;
    const url = isNew ? '/themes' : `/themes/${data._id}`;
    let updatedData = null;

    try {
      if (isNew) {
        // Use a different key than the URL here to avoid a cache conflict with GET /themes.
        updatedData = await httpClient.post(url, data);
      } else {
        updatedData = await mutate(url, httpClient.put(url, data));
      }

      showSuccessToast('Theme saved successfully.');

      return updatedData;
    } catch (error) {
      showErrorToast('Error saving theme.');
      throw error;
    }
  };

  const cloneTheme = async (sourceTheme) => {
    try {
      const clonedTheme = await httpClient.post(
        `/themes/${sourceTheme._id}/clone`
      );

      showSuccessToast(`Theme cloned successfully.`);

      return clonedTheme;
    } catch (error) {
      showErrorToast('Error cloning theme.');
      throw error;
    }
  };

  if (!themeLoaded && !themeLoading) {
    setThemeLoaded(true);
  }

  return {
    theme,
    themeLoading,
    themeLoaded,
    themeError,
    saveTheme,
    cloneTheme
  };
};

export default useTheme;
