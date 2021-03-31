import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Brush as PopupThemesIcon, Add as AddIcon } from '@material-ui/icons';
import { Layout, Link } from '../../components';

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: 'absolute',
    right: theme.spacing(6),
    bottom: theme.spacing(6)
  }
}));

const PopupThemesPage = () => {
  const classes = useStyles();

  return (
    <Layout title="Popup Themes" icon={<PopupThemesIcon />}>
      Popup Themes page
      <Fab
        className={classes.addButton}
        color="primary"
        aria-label="Add"
        component={Link}
        href="/popup-themes/new"
      >
        <AddIcon />
      </Fab>
    </Layout>
  );
};

export default PopupThemesPage;
