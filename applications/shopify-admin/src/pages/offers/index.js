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
import { useOffers } from '@neatowebsolutions/upselling-react-hooks';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import { TitleBar, OfferList } from '../../components';

const PageTitleBar = memo(() => <TitleBar title="Offers" />);

const OffersPage = () => {
  const { offers, offersLoading, offersError, fetchOffers } = useOffers();

  const loadingComponent = memo(() => (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  ));

  const emptyComponent = memo(() => (
    <EmptyState
      heading="Manage your offers"
      action={{ content: 'Add offer', url: '/offers/new/' }}
      image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
    >
      Create new offers to increase your sales.
    </EmptyState>
  ));

  const errorComponent = memo(() => (
    <Banner
      title="Unable to load offers"
      status="critical"
      action={{
        content: 'Try again',
        loading: offersLoading,
        onAction: () => fetchOffers()
      }}
    >
      Unable to load offers. Please try again shortly.
    </Banner>
  ));

  return (
    <Page title="Offers" fullWidth>
      {offersLoading && <Loading />}
      <PageTitleBar />
      <Loader
        isLoading={offersLoading}
        isError={!!offersError}
        isEmpty={!!offers && offers.length === 0}
        loadingComponent={loadingComponent}
        errorComponent={errorComponent}
        emptyStateComponent={emptyComponent}
      >
        <OfferList offers={offers} />
      </Loader>
    </Page>
  );
};

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default OffersPage;
