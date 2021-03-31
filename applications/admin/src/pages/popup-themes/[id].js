import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Layout, Link, PopupThemeEditor } from '../../components';
import { usePopupTheme } from '../../hooks';

const EditPopupThemePage = () => {
  // TODO: Replace with data from API.
  const { popupTheme } = usePopupTheme();

  const handleSubmit = (/* values */) => {
    // TODO
  };

  // TODO: Skeleton loading.

  return (
    <Layout
      title={
        <>
          <Link href="/popup-themes">Popup Themes</Link>&nbsp;/ Edit Popup Theme
        </>
      }
      icon={<PopupThemesIcon />}
    >
      <PopupThemeEditor initialValues={popupTheme} onSubmit={handleSubmit} />
    </Layout>
  );
};

export default EditPopupThemePage;
