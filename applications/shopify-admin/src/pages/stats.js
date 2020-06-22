import { memo } from 'react';
import { Page, Layout, Card } from '@shopify/polaris';
import { TitleBar, AcceptedOffersChart } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Dashboard" />);

const StatsPage = () => (
  <Page>
    <PageTitleBar />
    <Layout>
      <Layout.Section oneHalf>
        <Card sectioned>
          <AcceptedOffersChart />
        </Card>
        <Card sectioned>
          <AcceptedOffersChart />
        </Card>
      </Layout.Section>
      <Layout.Section oneHalf>
        <Card sectioned>
          <AcceptedOffersChart />
        </Card>
        <Card sectioned>
          <AcceptedOffersChart />
        </Card>
      </Layout.Section>
    </Layout>
  </Page>
);

export default StatsPage;
