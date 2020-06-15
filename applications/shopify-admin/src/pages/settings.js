import { memo } from 'react';
import { Page, Layout } from '@shopify/polaris';
import { TitleBar } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Settings" />);

const SettingsPage = () => (
  <Page title="Settings">
    <PageTitleBar />
    <Layout>Settings page!</Layout>
  </Page>
);

export default SettingsPage;
