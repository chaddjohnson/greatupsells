import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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
  ListItemText
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as MenuCloseIcon,
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
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
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
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

const Layout = ({ title, icon, children }) => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = React.useState(true);

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: menuOpen
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open menu"
            onClick={handleOpenMenu}
            edge="start"
            className={clsx(classes.menuButton, menuOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {icon && <span className={classes.titleIcon}>{icon}</span>}
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={menuOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleCloseMenu}>
            {menuOpen ? <MenuCloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
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
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: menuOpen
        })}
      >
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
