import { memo } from 'react';
import { Page, Layout } from '@shopify/polaris';
import { TitleBar } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Dashboard" />);

export default () => (
  <Page title="Dashboard">
    <PageTitleBar />
    <Layout>Dashboard page!</Layout>
  </Page>
);
