import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import Link from '../Link';
import PopupThemeMenu from './PopupThemeMenu';
import dummyData from '../dummyCrossSellData.json';
// import dummyData from '../dummyUpsellData.json';

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
  categoriesTableCell: {
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

  const [popupThemeExportHtml, setPopupThemeExportHtml] = useState();
  const [previewActive, setPreviewActive] = useState(false);
  const [popupInitialized, setPopupInitialized] = useState(false);

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
        setPopupThemeExportHtml(encodeURIComponent(html));
      }

      setPopupInitialized(true);
    }, 500);
  }, [previewContainerElement]);

  return (
    <TableRow {...props}>
      <TableCell className={classes.nameTableCell}>
        <Link href={`/popup-themes/${popupTheme._id}`}>{popupTheme.name}</Link>
      </TableCell>
      <TableCell className={classes.strategyTableCell}>
        {strategyMap[popupTheme.strategy] || popupTheme.strategy}
      </TableCell>
      <TableCell className={classes.categoriesTableCell}>
        {popupTheme.categories.join(', ')}
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
          popupThemeExportUrl={`data:text/html;charset=utf-8,${popupThemeExportHtml}`}
          onClonePopupTheme={onClonePopupTheme}
          onPreviewPopupTheme={handlePreview}
        />
        <div
          ref={previewContainerElement}
          style={{
            display: previewActive ? 'block' : 'none'
          }}
        >
          <OfferPopup
            className="preview"
            open={previewActive || !popupInitialized}
            forceDisplayType="desktop"
            shop={dummyData.shop}
            theme={popupTheme}
            offer={dummyData.offer}
            triggerProduct={dummyData.triggerProduct}
            offeredProducts={dummyData.offeredProducts}
            onClose={handleClosePreview}
            onClick={handlePreview}
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
