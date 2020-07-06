import { memo } from 'react';
import { Page } from '@shopify/polaris';
import { TitleBar, OfferForm } from '../../components';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Create offer"
    primaryAction={null}
    breadcrumbs={[{ content: 'Offers', url: '/offers' }]}
  />
));

const offer = {
  name: '',
  strategy: 'UPSELL',
  callToActionText: '',
  successMessageText: '',
  actionButtonText: 'Add to cart',
  cancelButtonText: 'No thanks',
  actionButtonBehavior: 'CART',
  popupThemeType: 'CUSTOM',
  popupTheme: {
    callToActionTextColor: '#3D4246',
    successMessageTextColor: '#FFFFFF',
    successMessageBackgroundColor: '#91BD49',
    actionButtonBackgroundColor: '#91BD49',
    actionButtonTextColor: '#FFFFFF',
    // actionButtonFontFamily,
    cancelButtonTextColor: '#999999',
    priceTextColor: '#000000',
    salePriceTextColor: '#800000',
    popupBackgroundColor: '#FFFFFF'
    // popupFontFamily,
    // notificationBannerBackgroundColor,
    // notificationBannerTextColor,
  },
  products: [],
  minimumProductsQuantity: 1,
  collections: [],
  discountType: 'PERCENTAGE',
  // discountAmount
  triggerEvent: 'ADD',
  triggerProducts: [],
  triggerCollections: [],
  startAt: new Date(),
  enableTimer: false,
  timerText: 'Ends in',
  timerCountdownStart: 3000,
  allowWithDiscountCodes: true,
  allowMultipleUpsells: true,
  hideIfItemAdded: false,
  showNotificationBanner: true,
  enableQuantitySelection: false,
  limitQuantitySelection: false,
  enableProductLinks: true,
  hideOutOfStockProducts: true,
  // discountCodes
  // discountPricingMethod
  enabled: true
};

const OfferCreatePage = () => {
  return (
    <Page title="Create offer">
      <PageTitleBar />
      <OfferForm offer={offer} />
    </Page>
  );
};

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default OfferCreatePage;
