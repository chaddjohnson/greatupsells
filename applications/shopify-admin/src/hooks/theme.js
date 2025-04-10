import { mutate } from 'swr';
import { useHttpClient } from '@greatupsells/react-hooks';

const useTheme = () => {
  const { httpClient } = useHttpClient();

  const saveTheme = async (data) => {
    const isNew = !data._id;
    const url = isNew ? '/themes' : `/themes/${data._id}`;
    let updatedData = null;
    const offerId = data.offer;

    if (isNew) {
      updatedData = await httpClient.post(url, data);
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
