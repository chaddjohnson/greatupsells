import { memo } from 'react';
import {
  Page,
  Layout,
  Card,
  CalloutCard,
  MediaCard,
  DisplayText,
  TextStyle
} from '@shopify/polaris';
import styled from 'styled-components';
import { TitleBar, AcceptedOffersChart } from '../components';

const StatsFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  flex: 1 1 0%;
  text-align: center;
`;

const StatLabel = styled.div`
  margin-top: 1rem;
  font-size: 1.5rem;
`;

const PageTitleBar = memo(() => <TitleBar title="Dashboard" />);

const DashboardPage = () => (
  <Page>
    <PageTitleBar />
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <StatsFlex>
            <Stat>
              <DisplayText size="extraLarge">96</DisplayText>
              <StatLabel>
                <TextStyle variation="strong">Accepted offers</TextStyle>
              </StatLabel>
            </Stat>
            <Stat>
              <DisplayText size="extraLarge">$1,214.16</DisplayText>
              <StatLabel>
                <TextStyle variation="strong">Revenue increase</TextStyle>
              </StatLabel>
            </Stat>
            <Stat>
              <DisplayText size="extraLarge">3.2%</DisplayText>
              <StatLabel>
                <TextStyle variation="strong">Conversion rate</TextStyle>
              </StatLabel>
            </Stat>
          </StatsFlex>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card
          title="Accepted offers"
          sectioned
          actions={[{ content: 'View all analytics', url: '/analytics' }]}
        >
          <AcceptedOffersChart />
        </Card>
      </Layout.Section>
      <Layout.Section>
        <CalloutCard
          title="Add upsell and cross-sell offers to your store"
          primaryAction={{
            content: 'Create offer',
            url: '/offers/new'
          }}
          secondaryAction={{
            content: 'Manage your offers',
            url: '/offers'
          }}
        >
          <p>
            Upselling and cross-selling are two of the most effective ways to
            increase sales in your store.
          </p>
        </CalloutCard>
        <MediaCard
          title="Getting Started"
          primaryAction={{
            content: 'Visit the tutorials',
            url: 'https://tutorials.domain.com'
          }}
          // description="Discover how Shopify can power up your entrepreneurial journey."
          description="Learn how to use Great Upsells to boost your sales and revenue."
        >
          <img
            alt=""
            width="100%"
            height="100%"
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            src="/images/tutorials.svg"
          />
        </MediaCard>
      </Layout.Section>
    </Layout>
  </Page>
);

export default DashboardPage;
