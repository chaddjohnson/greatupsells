import { memo } from 'react';
import { Page, Layout } from '@shopify/polaris';
import { TitleBar } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Settings" />);

export default () => (
  <Page title="Settings">
    <PageTitleBar />
    <Layout>Settings page!</Layout>
  </Page>
);
