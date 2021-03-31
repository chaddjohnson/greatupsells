import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Menu as MenuIcon,
  Close as MenuCloseIcon,
  PieChartOutlined as DashboardIcon,
  BarChart as StatsIcon,
  Store as ShopIcon,
  Brush as PopupThemesIcon,
  Notes as LogsIcon
} from '@material-ui/icons';
import Link from './Link';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },

    '& a': {
      color: theme.palette.primary.contrastText,
      textDecoration: 'none'
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  title: {
    display: 'flex',
    alignItems: 'center'
  },
  titleIcon: {
    marginRight: theme.spacing(1),
    lineHeight: 0
  },
  hide: {
    display: 'none'
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end',

    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },

  content: {
    flexGrow: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3)
  }
}));

const Layout = ({ title, icon, children }) => {
  const classes = useStyles();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleToggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  const drawer = (
    <>
      <Divider />
      <List>
        <ListItem button component={Link} href="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} href="/stats">
          <ListItemIcon>
            <StatsIcon />
          </ListItemIcon>
          <ListItemText primary="Stats" />
        </ListItem>
        <ListItem button component={Link} href="/shops">
          <ListItemIcon>
            <ShopIcon />
          </ListItemIcon>
          <ListItemText primary="Shops" />
        </ListItem>
        <ListItem button component={Link} href="/popup-themes">
          <ListItemIcon>
            <PopupThemesIcon />
          </ListItemIcon>
          <ListItemText primary="Popup Themes" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} href="/logs">
          <ListItemIcon>
            <LogsIcon />
          </ListItemIcon>
          <ListItemText primary="Logs" />
        </ListItem>
      </List>
    </>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            aria-label="Open menu"
            color="inherit"
            edge="start"
            onClick={handleToggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {icon && <span className={classes.titleIcon}>{icon}</span>}
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileMenuOpen}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
            onClose={handleCloseMenu}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleCloseMenu}>
                <MenuCloseIcon />
              </IconButton>
            </div>
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            <div className={classes.drawerHeader} />
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.node.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired
};

export default Layout;
