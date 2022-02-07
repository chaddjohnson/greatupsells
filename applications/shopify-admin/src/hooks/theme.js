import { useHttpClient } from '@greatupsells/react-hooks';

const useTheme = () => {
  const { httpClient } = useHttpClient();

  const saveTheme = async (data) => {
    const isNew = !data._id;
    const url = isNew ? '/themes' : `/themes/${data._id}`;
    let updatedData = null;

    if (isNew) {
      // Use a different key than the URL here to avoid a cache conflict with GET /themes.
      updatedData = await httpClient.post(url, data);
    } else {
      updatedData = await httpClient.put(url, data);
    }

    return updatedData;
  };

  return { saveTheme };
};

export default useTheme;
