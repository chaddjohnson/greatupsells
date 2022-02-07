import { useState } from 'react';
import useSWR from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useThemes = () => {
  const { httpClient } = useHttpClient();
  const [themesLoaded, setThemesLoaded] = useState(false);
  const { data: themes, error: themesError } = useSWR(
    '/themes',
    httpClient.get.bind(httpClient),
    {
      revalidateOnFocus: false
    }
  );
  const themesLoading = !themes && !themesError;

  if (!themesLoaded && !themesLoading) {
    setThemesLoaded(true);
  }

  return {
    themes,
    themesLoading,
    themesLoaded,
    themesError
  };
};

export default useThemes;
