import { Breadcrumbs } from '@material-ui/core';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Layout, Link, PopupThemeEditor } from '../../components';

const NewPopupThemePage = () => {
  const handleSubmit = (/* values */) => {
    // TODO
  };

  return (
    <Layout
      title={
        <Breadcrumbs>
          <Link href="/popup-themes">Popup Themes</Link>
          <span>New Popup Theme</span>
        </Breadcrumbs>
      }
      icon={<PopupThemesIcon />}
    >
      <PopupThemeEditor onSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewPopupThemePage;
