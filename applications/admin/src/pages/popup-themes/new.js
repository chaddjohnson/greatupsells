import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Layout, Link, PopupThemeEditor } from '../../components';

const NewPopupThemePage = () => {
  const handleSubmit = (/* values */) => {
    // TODO
  };

  return (
    <Layout
      title={
        <>
          <Link href="/popup-themes">Popup Themes</Link>&nbsp;/ New Popup Theme
        </>
      }
      icon={<PopupThemesIcon />}
    >
      <PopupThemeEditor onSubmit={handleSubmit} />
    </Layout>
  );
};

export default NewPopupThemePage;
