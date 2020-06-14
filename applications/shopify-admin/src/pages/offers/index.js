import { memo } from 'react';
import { Page } from '@shopify/polaris';
import { TitleBar, OfferList } from '../../components';

const PageTitleBar = memo(() => <TitleBar title="Offers" />);

export default () => {
  return (
    <Page title="Offers" fullWidth>
      <PageTitleBar />
      <OfferList />
    </Page>
  );
};
