import { memo } from 'react';
import { Page } from '@shopify/polaris';
import { TitleBar, OfferList } from '../../components';

const PageTitleBar = memo(() => <TitleBar title="Offers" />);

const OffersPage = () => {
  return (
    <Page title="Offers" fullWidth>
      <PageTitleBar />
      <OfferList />
    </Page>
  );
};

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default OffersPage;
