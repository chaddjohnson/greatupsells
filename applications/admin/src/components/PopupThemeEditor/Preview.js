import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { StyleSheetManager } from 'styled-components';

const { OfferPopup } =
  (typeof window !== 'undefined' &&
    require('@neatowebsolutions/upselling-react-components')) ||
  {};

const dummyData = {
  offer: {
    viewCount: 203,
    acceptanceCount: 0,
    conversionCount: 0,
    conversionRate: 0,
    revenueIncrease: 0,
    enableGeotargeting: true,
    geotargetingCountries: ['AU', 'US'],
    enableTimer: false,
    allowWithDiscountCodes: true,
    allowMultipleUpsells: true,
    hideIfItemAdded: true,
    showNotificationBanner: true,
    enableQuantitySelection: true,
    limitQuantitySelection: true,
    enableProductLinks: true,
    hideOutOfStockProducts: true,
    enableEscClose: true,
    enableMaskClose: true,
    enabled: true,
    _id: '602d83ce6e555811fa75e378',
    shop: '60397d65bbf915b947ae9cce',
    shopifyShopId: 27708653613,
    name: 'Test Offer 2',
    strategy: 'CROSS_SELL',
    actionButtonBehavior: 'CART',
    offeredProducts: [
      {
        title: 'Fancy Ass Hat',
        imageUrl:
          'https://cdn.shopify.com/s/files/1/0277/0865/3613/products/hat_350x350.jpg?v=1580529428',
        shopifyProductId: 4552007483437
      }
    ],
    offeredCollections: [],
    minimumProductsQuantity: 1,
    discountType: 'PERCENTAGE',
    discountAmount: 0.1,
    triggerEvent: 'EXIT',
    triggerProducts: [],
    triggerCollections: [],
    startAt: '2021-02-11T18:57:09.431Z',
    updatedAt: '2021-03-18T19:14:05.936Z',
    popupTheme: '5f9f8ea6d0e5931ddfdbffbd'
  },
  triggerProduct: {
    title: 'Added Test Product',
    url: '/products/added-test-product',
    price: 21.99
  },
  offeredProducts: [
    {
      title: 'Offered Test Product 1',
      url: '/products/offered-test-product-1',
      thumbnailImageUrl:
        'https://cdn.shopify.com/s/files/1/0277/0865/3613/products/hat_200x.jpg?v=1580529428',
      price: 16.99,
      salePrice: 15.99
    },
    {
      title: 'Offered Test Product 2',
      url: '/products/offered-test-product-2',
      thumbnailImageUrl:
        'https://cdn.shopify.com/s/files/1/0277/0865/3613/products/shoes_200x.jpg?v=1580520943',
      price: 12.99,
      salePrice: 11.99
    },
    {
      title: 'Offered Test Product 3',
      url: '/products/offered-test-product-3',
      thumbnailImageUrl:
        'https://cdn.shopify.com/s/files/1/0277/0865/3613/products/blue_pig_01_200x.jpg?v=1616175771',
      price: 8.99,
      salePrice: 7.99
    },
    {
      title: 'Offered Test Product 3',
      url: '/products/offered-test-product-3',
      thumbnailImageUrl:
        'https://cdn.shopify.com/s/files/1/0277/0865/3613/products/blue_pig_01_200x.jpg?v=1616175771',
      price: 8.99,
      salePrice: 7.99
    }
  ]
};

// Reference: https://codesandbox.io/s/react-iframe-examples-36k1x?file=/src/examples/with-styled-components.js
const Preview = ({ popupTheme, ...props }) => {
  const [previewRef, setPreviewRef] = useState(null);
  const [previewActive, setPreviewActive] = useState(false);

  const doc = previewRef?.contentWindow?.document;
  const mountNode = doc?.body;
  const insertionTarget = useMemo(() => doc?.createElement('link'), [doc]);

  useEffect(() => {
    if (insertionTarget) {
      doc.head.append(insertionTarget);
    }
  }, [doc, insertionTarget]);

  if (!popupTheme.template) {
    return null;
  }

  return (
    <iframe title="Preview" ref={setPreviewRef} {...props}>
      {mountNode &&
        createPortal(
          <>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  body {
                    margin: 0;
                    padding: 0;
                  }
                `
              }}
            />
            <StyleSheetManager target={insertionTarget}>
              <OfferPopup
                appRoot={mountNode}
                renderTo={!previewActive && mountNode}
                open={true}
                previewMode={true}
                theme={popupTheme}
                offer={dummyData.offer}
                triggerProduct={dummyData.triggerProduct}
                offeredProducts={dummyData.offeredProducts}
                onClose={() => setPreviewActive(false)}
                onClick={() => setPreviewActive(true)}
              />
            </StyleSheetManager>
          </>,
          mountNode
        )}
    </iframe>
  );
};

Preview.propTypes = {
  popupTheme: PropTypes.object
};

export default Preview;
