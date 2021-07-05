import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dummyData from './dummyData.json';

const { OfferPopup } =
  (typeof window !== 'undefined' &&
    require('@neatowebsolutions/upselling-react-components')) ||
  {};

const Preview = ({ className, popupTheme }) => {
  const [previewActive, setPreviewActive] = useState(false);

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
      onClose={() => setPreviewActive(false)}
      onClick={() => setPreviewActive(true)}
    />
  );
};

Preview.propTypes = {
  className: PropTypes.string,
  popupTheme: PropTypes.object
};

export default Preview;
