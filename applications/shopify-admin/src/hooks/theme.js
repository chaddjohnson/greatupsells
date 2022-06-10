import { useHttpClient } from '@greatupsells/react-hooks';
import { mutate } from 'swr';

const useTheme = () => {
  const { httpClient } = useHttpClient();

  const saveTheme = async (data) => {
    const isNew = !data._id;
    const url = isNew ? '/themes' : `/themes/${data._id}`;
    let updatedData = null;
    const offerId = data.offer;

    if (isNew) {
      // Use a different key than the URL here to avoid a cache conflict with GET /themes.
      updatedData = await mutate(url, httpClient.post(url, data));
    } else {
      updatedData = await mutate(url, httpClient.put(url, data));

      // Reload themes for the offer.
      await mutate(`/offers/${offerId}/themes`);
    }

    return updatedData;
  };

  return { saveTheme };
};

export default useTheme;
