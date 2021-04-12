import { Breadcrumbs, Hidden } from '@material-ui/core';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Layout, Link, PopupThemeEditor } from '../../components';
import { usePopupTheme } from '../../hooks';

const initialValues = {
  // name: ''
};

const NewPopupThemePage = () => {
  const { savePopupTheme } = usePopupTheme();

  const handleSubmit = async (values) => {
    await savePopupTheme(values);
  };

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
            <span>New Popup Theme</span>
          </Hidden>
        </>
      }
      icon={<PopupThemesIcon />}
    >
      <PopupThemeEditor initialValues={initialValues} onSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewPopupThemePage;
