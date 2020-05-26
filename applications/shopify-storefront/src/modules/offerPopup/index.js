import React from 'react';
import ReactDOM from 'react-dom';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import './styles.css';

const root = document.createElement('div');

const product = {
  // ...
};

const offer = {
  name: '',
  strategy: 'upsell',
  callToActionText: 'Buy one get one 10% off',
  actionButtonText: 'Add to cart',
  cancelButtonText: 'No thanks',
  actionButtonBehavior: 'cart',
  popupThemeType: 'template',
  popupTheme: {
    callToActionTextColor: '#3D4246',
    successMessageTextColor: '#FFFFFF',
    priceTextColor: '#000000',
    salePriceTextColor: '#800000',
    actionButtonBackgroundColor: '#91BD49',
    actionButtonTextColor: '#FFFFFF',
    cancelButtonTextColor: '#999999',
    popupBackgroundColor: '#FFFFFF'
  },
  enableProductLinks: true,
  hideOutOfStockProducts: true,
  allowMultipleUpsells: true,
  showNotificationBanner: true,
  allowWithDiscountCodes: true,
  enableQuantitySelection: false,
  productQuantityLimit: 1,
  limitQuantitySelection: false,
  upsellProductsQuantity: 1,
  enableTimer: false,
  startAt: new Date()
  // ...
};

const offerProduct = {
  title: 'Example Product',
  price: 14.99,
  salePrice: 12.99
  // ...
};

root.setAttribute('id', 'upselling-popup-root');
document.body.appendChild(root);

ReactDOM.render(
  <OfferPopup
    appRoot="#upselling-popup-root"
    open={true}
    product={product}
    offer={offer}
    offerProduct={offerProduct}
  />,
  document.getElementById('upselling-popup-root')
);
