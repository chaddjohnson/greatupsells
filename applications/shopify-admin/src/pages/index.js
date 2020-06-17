import { memo } from 'react';
import { useRouter } from 'next/router';
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
import { TitleBar } from '../components';

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

const DashboardPage = () => {
  const router = useRouter();

  return (
    <Page>
      <PageTitleBar />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <StatsFlex>
              <Stat>
                <DisplayText size="extraLarge">
                  <TextStyle variation="positive">96</TextStyle>
                </DisplayText>
                <StatLabel>
                  <TextStyle variation="strong">Accepted offers</TextStyle>
                </StatLabel>
              </Stat>
              <Stat>
                <DisplayText size="extraLarge">
                  <TextStyle variation="positive">$1,214.16</TextStyle>
                </DisplayText>
                <StatLabel>
                  <TextStyle variation="strong">Revenue increase</TextStyle>
                </StatLabel>
              </Stat>
              <Stat>
                <DisplayText size="extraLarge">
                  <TextStyle variation="positive">3.2%</TextStyle>
                </DisplayText>
                <StatLabel>
                  <TextStyle variation="strong">Avg. conversion rate</TextStyle>
                </StatLabel>
              </Stat>
            </StatsFlex>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card title="Accepted offers" sectioned>
            Chart
          </Card>
          <Card title="Overall revenue increase" sectioned>
            Chart
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card title="Average conversion rate" sectioned>
            Chart
          </Card>
          <Card title="Best converting offers" sectioned>
            Chart
          </Card>
        </Layout.Section>
        <Layout.Section>
          <CalloutCard
            title="Add upsell and cross-sell offers to your store"
            primaryAction={{
              content: 'Create offer'
            }}
            secondaryAction={{
              content: 'Manage your offers',
              onAction: () => router.push('/offers')
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
              // content: 'Learn about getting started',
              content: 'Visit the tutorials',
              onAction: () => {}
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
              src="https://burst.shopifycdn.com/photos/smiling-businesswoman-in-office.jpg?width=1850"
            />
          </MediaCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default DashboardPage;
