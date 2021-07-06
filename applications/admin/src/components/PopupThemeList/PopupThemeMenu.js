import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';
import clsx from 'clsx';
import Link from '../Link';
import Preview from '../PopupThemeEditor/PopupTemplateEditor/Preview';

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.text.primary
  },
  preview: {
    display: 'none'
  }
}));

const PopupThemeMenu = ({ popupTheme, onClonePopupTheme }) => {
  const classes = useStyles();

  const [menuAnchorElement, setMenuAnchorElement] = useState(null);
  const [popupThemeHtml, setPopupThemeHtml] = useState();

  const menuOpen = Boolean(menuAnchorElement);

  const previewContainerElement = useRef(null);

  const handleMenuOpen = (event) => {
    const iframe = previewContainerElement.current.querySelector('.preview');
    const html = iframe?.contentWindow.document.documentElement.outerHTML;

    setPopupThemeHtml(encodeURIComponent(html));
    setMenuAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorElement(null);
  };

  const handleCloneTheme = async () => {
    setMenuAnchorElement(null);
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
        <MenuItem onClick={handleCloneTheme}>Clone</MenuItem>
        <MenuItem
          className={classes.link}
          component={Link}
          href={`data:text/html;charset=utf-8,${popupThemeHtml}`}
          download={exportFileName}
          onClick={handleMenuClose}
        >
          Export HTML
        </MenuItem>
      </Menu>
      <div ref={previewContainerElement}>
        <Preview
          className={clsx(classes.preview, 'preview')}
          popupTheme={popupTheme}
        />
      </div>
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
