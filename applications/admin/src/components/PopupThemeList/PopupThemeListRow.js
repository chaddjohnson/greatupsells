import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '../Link';
import Preview from '../PopupThemeEditor/PopupTemplateEditor/Preview';
import PopupThemeMenu from './PopupThemeMenu';

const strategyMap = {
  UPSELL: 'Upsell',
  CROSS_SELL: 'Cross-sell',
  POPUP: 'Popup'
};

const useStyles = makeStyles((theme) => ({
  nameTableCell: {
    minWidth: 400
  },
  strategyTableCell: {
    minWidth: 200
  },
  categoryTableCell: {
    minWidth: 200
  },
  thumbnailTableCell: {
    minWidth: 100
  },
  thumbnail: {
    width: 'auto',
    height: 'auto',
    maxWidth: 80,
    maxHeight: 80,
    border: `1px solid ${theme.palette.action.selected}`
  }
}));

const PopupThemeListRow = ({ popupTheme, onClonePopupTheme, ...props }) => {
  const classes = useStyles();

  const [popupThemeHtml, setPopupThemeHtml] = useState();
  const [previewActive, setPreviewActive] = useState(false);

  const previewContainerElement = useRef(null);

  const handleClosePreview = () => {
    setPreviewActive(false);
  };

  const handlePreview = () => {
    setPreviewActive(true);
  };

  useEffect(() => {
    setTimeout(() => {
      const iframe = previewContainerElement.current.querySelector('.preview');
      const html = iframe?.contentWindow.document.documentElement.outerHTML;

      if (html) {
        setPopupThemeHtml(encodeURIComponent(html));
      }
    }, 0);
  }, [previewContainerElement]);

  return (
    <TableRow {...props}>
      <TableCell className={classes.nameTableCell}>
        <Link href={`/popup-themes/${popupTheme._id}`}>{popupTheme.name}</Link>
      </TableCell>
      <TableCell className={classes.strategyTableCell}>
        {strategyMap[popupTheme.strategy] || popupTheme.strategy}
      </TableCell>
      <TableCell className={classes.categoryTableCell}>
        {popupTheme.category}
      </TableCell>
      <TableCell className={classes.thumbnailTableCell}>
        <IconButton onClick={handlePreview}>
          <img
            className={classes.thumbnail}
            src={popupTheme.thumbnailImageUrl}
            alt="Preview"
          />
        </IconButton>
      </TableCell>
      <TableCell>
        <PopupThemeMenu
          popupTheme={popupTheme}
          popupThemeExportUrl={`data:text/html;charset=utf-8,${popupThemeHtml}`}
          onClonePopupTheme={onClonePopupTheme}
          onPreviewPopupTheme={handlePreview}
        />
        <div
          ref={previewContainerElement}
          style={{
            display: previewActive ? 'block' : 'none'
          }}
        >
          <Preview
            className="preview"
            popupTheme={popupTheme}
            previewActive={previewActive}
            onClosePreview={handleClosePreview}
            onPreview={handlePreview}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

PopupThemeListRow.propTypes = {
  popupTheme: PropTypes.object,
  onClonePopupTheme: PropTypes.func
};

PopupThemeListRow.defaultProps = {
  onClonePopupTheme: () => {}
};

export default PopupThemeListRow;
