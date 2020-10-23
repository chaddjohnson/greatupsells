import { memo } from 'react';
import { useRouter } from 'next/router';
import { Page } from '@shopify/polaris';
import { useShop, useOffer } from '@neatowebsolutions/upselling-react-hooks';
import { TitleBar, OfferForm } from '../../components';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Create offer"
    primaryAction={null}
    breadcrumbs={[{ content: 'Offers', url: '/offers/' }]}
  />
));

const initialOffer = {
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
  discountAmount: 0.1,
  triggerEvent: 'ADD',
  triggerProducts: [],
  triggerCollections: [],
  startAt: new Date().toISOString(),
  enableTimer: false,
  timerText: 'Ends in',
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
  const router = useRouter();
  const { shop } = useShop();
  const { createOffer } = useOffer();

  const handleCancel = () => router.push('/offers/');

  return (
    <Page title="Create offer">
      <PageTitleBar />
      <OfferForm
        initialValues={initialOffer}
        currency={shop?.currency}
        onSubmit={createOffer}
        onCancel={handleCancel}
      />
    </Page>
  );
};

export default OfferCreatePage;
