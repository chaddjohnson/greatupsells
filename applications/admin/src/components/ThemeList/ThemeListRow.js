import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { OfferPopup } from '@greatupsells/react-components';
import Link from '../Link';
import ThemeMenu from './ThemeMenu';
import dummyData from '../dummyCrossSellData.json';
// import dummyData from '../dummyUpsellData.json';

const strategyMap = {
  UPSELL: 'Upsell',
  CROSS_SELL: 'Cross-sell',
  POST_CHECKOUT: 'Post-checkout cross-sell',
  THANK_YOU_PAGE: 'Thank You Page',
  POPUP: 'Popup'
};

const useStyles = makeStyles((theme) => ({
  nameTableCell: {
    minWidth: 400
  },
  strategiesTableCell: {
    minWidth: 200
  },
  categoriesTableCell: {
    minWidth: 200
  },
  thumbnailTableCell: {
    minWidth: 100,
    textAlign: 'center'
  },
  thumbnail: {
    width: 'auto',
    height: 'auto',
    maxWidth: 80,
    maxHeight: 80,
    border: `1px solid ${theme.palette.action.selected}`
  }
}));

const ThemeListRow = ({ theme, onCloneTheme, ...props }) => {
  const classes = useStyles();

  const [themeExportHtml, setThemeExportHtml] = useState();
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
        setThemeExportHtml(encodeURIComponent(html));
      }

      setPopupInitialized(true);
    }, 500);
  }, [previewContainerElement]);

  return (
    <TableRow {...props}>
      <TableCell className={classes.nameTableCell}>
        <Link href={`/themes/${theme._id}`}>{theme.name}</Link>
      </TableCell>
      <TableCell className={classes.strategiesTableCell}>
        {theme.strategies.map((strategy, index) => (
          <div key={index}>{strategyMap[strategy] || strategy}</div>
        ))}
      </TableCell>
      <TableCell className={classes.categoriesTableCell}>
        {theme.categories.join(', ')}
      </TableCell>
      <TableCell className={classes.thumbnailTableCell}>
        <IconButton onClick={handlePreview}>
          <img
            className={classes.thumbnail}
            src={theme.thumbnailImageUrl}
            alt="Preview"
          />
        </IconButton>
      </TableCell>
      <TableCell>
        <ThemeMenu
          theme={theme}
          themeExportUrl={`data:text/html;charset=utf-8,${themeExportHtml}`}
          onCloneTheme={onCloneTheme}
          onPreviewTheme={handlePreview}
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
            theme={theme}
            offer={dummyData.offer}
            locale="en"
            countryCode="US"
            currency="USD"
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

ThemeListRow.propTypes = {
  theme: PropTypes.object,
  onCloneTheme: PropTypes.func
};

ThemeListRow.defaultProps = {
  onCloneTheme: () => {}
};

export default ThemeListRow;
