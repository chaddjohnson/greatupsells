import { memo } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { Loading } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import {
  ExternalMinor,
  DuplicateMinor,
  ShareMinor,
  CircleDisableMinor
} from '@shopify/polaris-icons';
import { TitleBar, OfferForm } from '../../../components';
import { OFFER } from '../../../graphql/queries';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Edit offer"
    primaryAction={null}
    breadcrumbs={[{ content: 'Offers', url: '/offers' }]}
  />
));

const OfferEditPage = () => {
  // const router = useRouter();
  // const { loading, data } = useQuery(OFFER, {
  //   variables: {
  //     id: router.query.id
  //   }
  // });
  // const { offer } = data;

  // if (loading) {
  //   return <Loading />;
  // }

  const offer = {
    _id: 'a702955babd0e0c9bdcf176c13b60a1f',
    name: 'Buy one get 10% off',
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

  const handleTest = () => {
    // ...
  };

  const handleDuplicate = () => {
    // ...
  };

  const handleToggleEnabled = () => {
    // ...
  };

  return (
    <Page
      title={offer.name}
      secondaryActions={[
        {
          content: 'Test',
          accessibilityLabel: 'Test this offer',
          icon: ExternalMinor,
          onAction: handleTest
        },
        {
          content: 'Duplicate',
          accessibilityLabel: 'Duplicate this offer',
          icon: DuplicateMinor,
          onAction: handleDuplicate
        },
        {
          content: offer.enabled ? 'Disable' : 'Enable',
          accessibilityLabel: offer.enabled
            ? 'Disable this offer'
            : 'Enable this offer',
          icon: CircleDisableMinor,
          onAction: handleToggleEnabled
        }
      ]}
    >
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

export default OfferEditPage;
