import { Breadcrumbs, Hidden } from '@material-ui/core';
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
          <Hidden xsDown>
            <Breadcrumbs>
              <Link href="/popup-themes">Popup Themes</Link>
              <span>New Popup Theme</span>
            </Breadcrumbs>
          </Hidden>
          <Hidden smUp>
            <span>Edit Popup Theme</span>
          </Hidden>
        </>
      }
      icon={<PopupThemesIcon />}
    >
      <PopupThemeEditor initialValues={popupTheme} onSubmit={handleSubmit} />
    </Layout>
  );
};

export default EditPopupThemePage;
