import { memo } from 'react';
import { useRouter } from 'next/router';
import { Page } from '@shopify/polaris';
import { useShop, useOffer } from '../../hooks';
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
  actionButtonBehavior: 'CART',
  offeredProducts: [],
  offeredCollections: [],
  minimumProductsQuantity: 1,
  discountType: 'PERCENTAGE',
  discountAmount: 0.1,
  triggerEvent: 'ADD',
  triggerProducts: [],
  triggerCollections: [],
  enableGeotargeting: true,
  geotargetingCountries: [],
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
  enableEscClose: false,
  enableMaskClose: false,
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
      {shop && (
        <OfferForm
          initialValues={initialOffer}
          shop={shop}
          onSubmit={createOffer}
          onCancel={handleCancel}
        />
      )}
    </Page>
  );
};

export default OfferCreatePage;
