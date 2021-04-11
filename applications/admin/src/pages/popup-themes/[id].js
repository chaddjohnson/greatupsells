import { useRouter } from 'next/router';
import { Breadcrumbs, Hidden } from '@material-ui/core';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Layout, Link, PopupThemeEditor } from '../../components';
import { usePopupTheme } from '../../hooks';

const EditPopupThemePage = () => {
  const router = useRouter();
  const popupThemeId = router.query.id;

  const { popupTheme } = usePopupTheme(popupThemeId);

  const handleSubmit = (/* values */) => {
    // TODO
  };

  // TODO: Skeleton loading.
  // TODO: Remove this.
  if (!popupTheme) {
    return null;
  }

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
