import { memo } from 'react';
import { Loading } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import { useOffer } from '@neatowebsolutions/upselling-react-hooks';
import { TitleBar, OfferForm } from '../../components';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Create offer"
    primaryAction={null}
    breadcrumbs={[{ content: 'Offers', url: '/offers' }]}
  />
));

const OfferCreatePage = () => {
  const { offer, offerLoading, offerError, createOffer } = useOffer();

  return (
    <Page title="Create offer">
      {offerLoading && <Loading />}
      <PageTitleBar />
      <OfferForm offer={offer} onSubmit={createOffer} />
    </Page>
  );
};

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default OfferCreatePage;
