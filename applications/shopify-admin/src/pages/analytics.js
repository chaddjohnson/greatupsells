import { memo } from 'react';
import { Page, Layout, Card } from '@shopify/polaris';
import {
  TitleBar,
  AcceptedOffersChart,
  RevenueIncreaseChart,
  ConversionsChart,
  BestOffersChart
} from '../components';

const PageTitleBar = memo(() => <TitleBar title="Dashboard" />);

const AnalyticsPage = () => (
  <Page title="Analytics for offers">
    <PageTitleBar />
    <Layout>
      <Layout.Section oneHalf>
        <Card sectioned>
          <AcceptedOffersChart />
        </Card>
        <Card sectioned>
          <RevenueIncreaseChart />
        </Card>
      </Layout.Section>
      <Layout.Section oneHalf>
        <Card sectioned>
          <ConversionsChart />
        </Card>
        <Card sectioned>
          <BestOffersChart />
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
);

export default AnalyticsPage;
