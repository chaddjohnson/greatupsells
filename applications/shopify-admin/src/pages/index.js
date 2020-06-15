import { memo } from 'react';
import { Page, Layout } from '@shopify/polaris';
import { TitleBar } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Dashboard" />);

const DashboardPage = () => (
  <Page title="Dashboard">
    <PageTitleBar />
    <Layout>Dashboard page!</Layout>
  </Page>
);

export default DashboardPage;
