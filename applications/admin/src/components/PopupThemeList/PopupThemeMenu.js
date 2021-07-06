import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';
import Link from '../Link';

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.text.primary
  }
}));

const PopupThemeMenu = ({
  popupTheme,
  popupThemeExportUrl,
  onClonePopupTheme,
  onPreviewPopupTheme
}) => {
  const classes = useStyles();

  const [menuAnchorElement, setMenuAnchorElement] = useState(null);
  const menuOpen = Boolean(menuAnchorElement);

  const handleMenuOpen = (event) => {
    setMenuAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorElement(null);
  };

  const handlePreviewTheme = () => {
    handleMenuClose();
    onPreviewPopupTheme();
  };

  const handleCloneTheme = async () => {
    handleMenuClose();
    await onClonePopupTheme(popupTheme);
  };

  const exportFileName = useMemo(
    () =>
      `${popupTheme.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\- ]/g, '')
        .replace(/\s+/g, '-')}.html`,
    [popupTheme]
  );

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorElement}
        keepMounted
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch'
          }
        }}
      >
        <MenuItem onClick={handlePreviewTheme}>Preview</MenuItem>
        <MenuItem onClick={handleCloneTheme}>Clone</MenuItem>
        <MenuItem
          className={classes.link}
          component={Link}
          href={popupThemeExportUrl}
          download={exportFileName}
          onClick={handleMenuClose}
        >
          Export HTML
        </MenuItem>
      </Menu>
    </>
  );
};

PopupThemeMenu.propTypes = {
  popupTheme: PropTypes.object,
  popupThemeExportUrl: PropTypes.string,
  onClonePopupTheme: PropTypes.func,
  onPreviewPopupTheme: PropTypes.func
};

PopupThemeMenu.defaultProps = {
  popupThemeExportUrl: '',
  onClonePopupTheme: () => {},
  onPreviewPopupTheme: () => {}
};

export default PopupThemeMenu;
