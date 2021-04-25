import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const usePopupTheme = () => {
  const { httpClient } = useHttpClient();

  const savePopupTheme = async (data) => {
    const isNew = !data._id;
    const url = isNew ? '/popup-themes' : `/popup-theme/${data._id}`;
    let updatedData = null;

    if (isNew) {
      // Use a different key than the URL here to avoid a cache conflict with GET /popup-themes.
      updatedData = await httpClient.post(url, data);
    } else {
      updatedData = await httpClient.put(url, data);
    }

    return updatedData;
  };

  return { savePopupTheme };
};

export default usePopupTheme;
