import { memo, useState, useEffect } from 'react';
import { Page, Banner, Layout, Card, BlockStack, SkeletonPage, SkeletonBodyText, EmptyState } from '@shopify/polaris';
import { Loader } from '@greatupsells/react-components';
import { useOffers } from '../../hooks';
import { OfferList } from '../../components';

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
  const [loadedOffers, setLoadedOffers] = useState([]);

  const hasFilters = Object.keys(filters).length > 0;

  useEffect(() => {
    if (offers) {
      setLoadedOffers(offers);
    }
  }, [offers]);

  const ErrorComponent = memo(() => (
    <Page fullWidth>
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
      <Page title="Offers" fullWidth primaryAction={{ content: 'Add offer', url: '/offers/new' }}>
        <Layout>
          <Layout.Section>
            <OfferList offers={loadedOffers} loading={offersLoading} filters={filters} onFilter={setFilters} />
          </Layout.Section>
        </Layout>
      </Page>
    </Loader>
  );
};

export default OffersPage;
