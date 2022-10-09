import React, { useState } from 'react';
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
  Notes as LogsIcon
} from '@material-ui/icons';
import Link from './Link';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    marginLeft: 0,

    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    }
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
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
    alignItems: 'center',
    fontSize: '20px',
    fontWeight: 500,
    letterSpacing: 0.15
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
  link: {
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3)
  }
}));

const Layout = ({ title, icon, contentProps, children }) => {
  const classes = useStyles();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <ListItem button component="li">
          <Link className={classes.link} href="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </Link>
        </ListItem>
        <ListItem button component="li">
          <Link className={classes.link} href="/stats">
            <ListItemIcon>
              <StatsIcon />
            </ListItemIcon>
            <ListItemText primary="Stats" />
          </Link>
        </ListItem>
        <ListItem button component="li">
          <Link className={classes.link} href="/shops">
            <ListItemIcon>
              <ShopIcon />
            </ListItemIcon>
            <ListItemText primary="Shops" />
          </Link>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component="li">
          <Link className={classes.link} href="/logs">
            <ListItemIcon>
              <LogsIcon />
            </ListItemIcon>
            <ListItemText primary="Logs" />
          </Link>
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
          <Typography className={classes.title} variant="h1" noWrap>
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
      <main className={classes.content} {...contentProps}>
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.node.isRequired,
  icon: PropTypes.node,
  contentProps: PropTypes.object,
  children: PropTypes.node.isRequired
};

export default Layout;
