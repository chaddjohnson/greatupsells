import { memo } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  TextContainer,
  Banner,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText
} from '@shopify/polaris';
import {
  ExternalMinor,
  DuplicateMinor,
  CircleDisableMinor
} from '@shopify/polaris-icons';
import { useOffer } from '@neatowebsolutions/upselling-react-hooks';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import { TitleBar, OfferForm } from '../../../components';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Edit offer"
    primaryAction={null}
    breadcrumbs={[{ content: 'Offers', url: '/offers/' }]}
  />
));

const loadingComponent = () => (
  <>
    <Loading />
    <SkeletonPage secondaryActions={3}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card subdued>
            <Card.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  </>
);

const OfferEditPage = () => {
  const router = useRouter();
  const offerId = router.query.id;
  const { offer, offerLoading, offerError, updateOffer, fetchOffer } = useOffer(
    offerId
  );

  const errorComponent = memo(() => (
    <Page fullWidth>
      <Banner
        title="Unable to load offer"
        status="critical"
        action={{
          content: 'Try again',
          onAction: () => fetchOffer()
        }}
      >
        Unable to load offer. Please try again shortly.
      </Banner>
    </Page>
  ));

  const handleCancel = () => router.push('/offers/');

  const handleTest = () => {
    // ...
  };

  const handleDuplicate = () => {
    // ...
  };

  const handleToggleEnabled = () => {
    // ...
  };

  const secondaryActions = [
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
      content: offer?.enabled ? 'Disable' : 'Enable',
      accessibilityLabel: offer?.enabled
        ? 'Disable this offer'
        : 'Enable this offer',
      icon: CircleDisableMinor,
      onAction: handleToggleEnabled
    }
  ];

  return (
    <Loader
      isLoading={offerLoading}
      isError={!!offerError}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page title={offer?.name} secondaryActions={secondaryActions}>
        <PageTitleBar />
        <OfferForm
          initialValues={offer}
          onSubmit={updateOffer}
          onCancel={handleCancel}
        />
      </Page>
    </Loader>
  );
};

export default OfferEditPage;
