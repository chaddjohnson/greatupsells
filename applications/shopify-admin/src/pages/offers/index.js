import { memo } from 'react';
import { Loading } from '@shopify/app-bridge-react';
import {
  Page,
  Banner,
  Layout,
  Card,
  SkeletonPage,
  SkeletonBodyText,
  EmptyState
} from '@shopify/polaris';
import { Loader } from '@greatupsellsreact-components';
import { useShop, useOffers } from '../../hooks';
import { TitleBar, OfferList } from '../../components';

const PageTitleBar = memo(() => <TitleBar title="Offers" />);

const LoadingComponent = () => (
  <>
    <Loading />
    <SkeletonPage title="Offers" fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText lines={3} />
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  </>
);

const EmptyComponent = () => (
  <EmptyState
    heading="Manage your offers"
    action={{ content: 'Add offer', url: '/offers/new/' }}
    image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
  >
    Create new offers to increase your sales.
  </EmptyState>
);

const OffersPage = () => {
  const { shop } = useShop();
  const { offers, offersLoading, offersError } = useOffers();

  const ErrorComponent = memo(() => (
    <Page title="Offers" fullWidth>
      <Banner
        title="Unable to load offers"
        status="critical"
        action={{
          content: 'Try again',
          onAction: () => window.location.reload()
        }}
      >
        Unable to load offers. Please try again shortly.
      </Banner>
    </Page>
  ));

  return (
    <Loader
      isLoading={offersLoading}
      isError={!!offersError && !offers}
      isEmpty={!offers?.length}
      loadingComponent={LoadingComponent}
      errorComponent={ErrorComponent}
      emptyStateComponent={EmptyComponent}
    >
      <Page title="Offers" fullWidth>
        <PageTitleBar />
        <OfferList offers={offers} currency={shop?.currency} />
      </Page>
    </Loader>
  );
};

export default OffersPage;
