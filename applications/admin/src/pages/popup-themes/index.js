import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Layout, Link, AddButton } from '../../components';

const PopupThemesPage = () => (
  <Layout title="Popup Themes" icon={<PopupThemesIcon />}>
    Popup Themes page
    <AddButton
      color="primary"
      aria-label="Add"
      component={Link}
      href="/popup-themes/new"
    />
  </Layout>
);

export default PopupThemesPage;
