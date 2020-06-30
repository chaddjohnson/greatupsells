import { memo } from 'react';
import { Page, Layout, Card } from '@shopify/polaris';
import {
  TitleBar,
  AcceptedOffersChart,
  RevenueIncreaseChart,
  OfferViewsChart,
  ConversionsChart
} from '../components';

const PageTitleBar = memo(() => <TitleBar title="Dashboard" />);

const AnalyticsPage = () => (
  <Page title="Analytics for offers" fullWidth>
    <PageTitleBar />
    <Layout>
      <Layout.Section oneHalf>
        <Card title="Accepted offers" sectioned>
          <AcceptedOffersChart />
        </Card>
        <Card title="Revenue increase" sectioned>
          <RevenueIncreaseChart />
        </Card>
      </Layout.Section>
      <Layout.Section oneHalf>
        <Card title="Offer views" sectioned>
          <OfferViewsChart />
        </Card>
        <Card title="Conversion rate" sectioned>
          <ConversionsChart />
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
);

export default AnalyticsPage;
