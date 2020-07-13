import { memo } from 'react';
import { Loading } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import { useOffers } from '@neatowebsolutions/upselling-react-hooks';
import { TitleBar, OfferList } from '../../components';

const PageTitleBar = memo(() => <TitleBar title="Offers" />);

const OffersPage = () => {
  const { offers, offersLoading, offersError } = useOffers();

  return (
    <Page title="Offers" fullWidth>
      {offersLoading && <Loading />}
      <PageTitleBar />
      <OfferList offers={offers} />
    </Page>
  );
};

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default OffersPage;
