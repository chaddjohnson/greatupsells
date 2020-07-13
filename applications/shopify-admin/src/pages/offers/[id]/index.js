import { memo } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import {
  ExternalMinor,
  DuplicateMinor,
  CircleDisableMinor
} from '@shopify/polaris-icons';
import { useOffer } from '@neatowebsolutions/upselling-react-hooks';
import { TitleBar, OfferForm } from '../../../components';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Edit offer"
    primaryAction={null}
    breadcrumbs={[{ content: 'Offers', url: '/offers' }]}
  />
));

const OfferEditPage = () => {
  const router = useRouter();
  const offerId = router.query.id;
  const { offer, offerLoading, offerError, updateOffer } = useOffer(offerId);

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
      {offerLoading && <Loading />}
      <PageTitleBar />
      <OfferForm offer={offer} onSubmit={updateOffer} />
    </Page>
  );
};

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default OfferEditPage;
