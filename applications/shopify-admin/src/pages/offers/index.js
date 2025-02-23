import { memo, useState } from 'react';
import { Page, Banner, Layout, Card, BlockStack, SkeletonPage, SkeletonBodyText, EmptyState } from '@shopify/polaris';
import { Loader } from '@greatupsells/react-components';
import { useOffers } from '../../hooks';
import { TitleBar, OfferList } from '../../components';

const PageTitleBar = memo(() => {
  // Include `shop` as a URL parameter to internal links to allow links to be opened in new tabs.
  const urlParams = sessionStorage.shop ? `?shop=${sessionStorage.shop}` : '';

  return (
    <TitleBar title="Offers">
      <a variant="breadcrumb" href={`/${urlParams}`}>
        Dashboard
      </a>
    </TitleBar>
  );
});

const LoadingComponent = () => (
  <SkeletonPage>
    <BlockStack gap="400" padding="400">
      <Card>
        <SkeletonBodyText lines={3} />
      </Card>
    </BlockStack>
  </SkeletonPage>
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
  const { offers, offersLoading, offersLoaded, offersError } = useOffers(filters);

  const hasFilters = Object.keys(filters).length > 0;

  const ErrorComponent = memo(() => (
    <Page fullWidth>
      <PageTitleBar />
      <Banner
        title="Unable to load offers"
        tone="critical"
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
      <Page fullWidth>
        <PageTitleBar />
        <Layout>
          <Layout.Section>
            <OfferList offers={offers} loading={offersLoading} filters={filters} onFilter={setFilters} />
          </Layout.Section>
        </Layout>
      </Page>
    </Loader>
  );
};

export default OffersPage;
