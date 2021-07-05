import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

const PopupThemeMenu = ({ popupTheme, onClonePopupTheme }) => {
  const [menuAnchorElement, setMenuAnchorElement] = useState(null);
  const menuOpen = Boolean(menuAnchorElement);

  const handleMenuOpen = (event) => {
    setMenuAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorElement(null);
  };

  const handleCloneTheme = async () => {
    await onClonePopupTheme(popupTheme);
  };

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
        <MenuItem onClick={handleCloneTheme}>Clone</MenuItem>
      </Menu>
    </>
  );
};

PopupThemeMenu.propTypes = {
  popupTheme: PropTypes.object,
  onClonePopupTheme: PropTypes.func
};

PopupThemeMenu.defaultProps = {
  onClonePopupTheme: () => {}
};

export default PopupThemeMenu;
