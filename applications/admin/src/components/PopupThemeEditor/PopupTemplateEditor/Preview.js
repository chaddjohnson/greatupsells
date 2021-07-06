import React from 'react';
import PropTypes from 'prop-types';
import dummyData from './dummyData.json';

const { OfferPopup } =
  (typeof window !== 'undefined' &&
    require('@neatowebsolutions/upselling-react-components')) ||
  {};

const Preview = ({
  className,
  popupTheme,
  previewActive,
  onClosePreview,
  onPreview
}) => {
  if (!popupTheme.template || !OfferPopup) {
    return null;
  }

  return (
    <OfferPopup
      className={className}
      open={true}
      designMode={!previewActive}
      forceDisplayType="desktop"
      shop={dummyData.shop}
      theme={popupTheme}
      offer={dummyData.offer}
      triggerProduct={dummyData.triggerProduct}
      offeredProducts={dummyData.offeredProducts}
      onClose={onClosePreview}
      onClick={onPreview}
    />
  );
};

Preview.propTypes = {
  className: PropTypes.string,
  popupTheme: PropTypes.object,
  previewActive: PropTypes.bool,
  onClosePreview: PropTypes.func,
  onPreview: PropTypes.func
};

Preview.defaultProps = {
  previewActive: false,
  onClosePreview: () => {},
  onPreview: () => {}
};

export default Preview;
