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
import { useShop, useOffers } from '@neatowebsolutions/upselling-react-hooks';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import { TitleBar, OfferList } from '../../components';

const PageTitleBar = memo(() => <TitleBar title="Offers" />);

const loadingComponent = () => (
  <>
    <Loading />
    <SkeletonPage fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  </>
);

const emptyComponent = () => (
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
  const { offers, offersLoading, offersError, fetchOffers } = useOffers();

  const errorComponent = memo(() => (
    <Page fullWidth>
      <Banner
        title="Unable to load offers"
        status="critical"
        action={{
          content: 'Try again',
          onAction: () => fetchOffers()
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
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
      emptyStateComponent={emptyComponent}
    >
      <Page title="Offers" fullWidth>
        <PageTitleBar />
        <OfferList offers={offers} currency={shop?.currency} />
      </Page>
    </Loader>
  );
};

export default OffersPage;
