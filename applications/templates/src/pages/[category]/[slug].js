import React from 'react';

const { OfferPopup } =
  (typeof window !== 'undefined' &&
    require('@neatowebsolutions/upselling-react-components')) ||
  {};

const offer = {
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
  popupTheme: null
};

const triggerProduct = {
  title: 'Added Test Product',
  url: '/products/added-test-product',
  price: 21.99
};

const offeredProducts = [
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
];

const TemplatePage = ({ data, template }) => {
  offer.popupTheme = data;
  offer.popupTheme.template = template;

  // Unsure why this is necessary...
  if (typeof OfferPopup === 'undefined') {
    return null;
  }

  return (
    <>
      <OfferPopup
        appRoot="#__next"
        open={true}
        previewMode={true}
        theme={offer.popupTheme}
        offer={offer}
        triggerProduct={triggerProduct}
        offeredProducts={offeredProducts}
      />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const fs = require('fs-extra');
  const path = require('path');

  const { category, slug } = context.query;
  const template = await fs.readFile(
    path.resolve('templates', category, slug, 'template.liquid'),
    'utf8'
  );
  const data = await fs.readJson(
    path.resolve('templates', category, slug, 'data.json')
  );

  return {
    props: {
      template,
      data
    }
  };
};

export default TemplatePage;
