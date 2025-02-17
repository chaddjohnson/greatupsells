import { memo, useState } from 'react';
import {
  Page,
  Banner,
  Layout,
  Card,
  SkeletonPage,
  SkeletonBodyText,
  EmptyState
} from '@shopify/polaris';
import { Loader } from '@greatupsells/react-components';
import { useOffers } from '../../hooks';
import { TitleBar, OfferList } from '../../components';

const PageTitleBar = memo(() => <TitleBar title="Offers" />);

const LoadingComponent = () => (
  <>
    <SkeletonPage title="Offers" fullWidth>
      <PageTitleBar />
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
  <>
    <PageTitleBar />
    <EmptyState
      heading="Manage your offers"
      action={{ content: 'Create an offer', url: '/offers/new/' }}
      image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
      Create new offers to increase your sales.
    </EmptyState>
  </>
);

const OffersPage = () => {
  const [filters, setFilters] = useState({});
  const { offers, offersLoaded, offersError } = useOffers(filters);

  const hasFilters = Object.keys(filters).length > 0;

  const ErrorComponent = memo(() => (
    <Page title="Offers" fullWidth>
      <PageTitleBar />
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
      isLoading={!offersLoaded}
      isError={!!offersError && !offers}
      isEmpty={!offers?.length && !hasFilters}
      loadingComponent={LoadingComponent}
      errorComponent={ErrorComponent}
      emptyStateComponent={EmptyComponent}
    >
      <Page title="Offers" fullWidth>
        <PageTitleBar />
        <Layout>
          <Layout.Section>
            <OfferList
              offers={offers}
              filters={filters}
              onFilter={setFilters}
            />
          </Layout.Section>
        </Layout>
      </Page>
    </Loader>
  );
};

export default OffersPage;
