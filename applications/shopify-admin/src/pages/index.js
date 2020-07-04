import { memo } from 'react';
import {
  Page,
  Layout,
  Card,
  CalloutCard,
  MediaCard,
  Stack,
  Heading,
  DisplayText,
  TextStyle,
  Button
} from '@shopify/polaris';
import styled from 'styled-components';
import { TitleBar, AcceptedOffersChart } from '../components';

const Stats = styled.div`
  text-align: center;
`;

const PageTitleBar = memo(() => <TitleBar title="Dashboard" />);

const DashboardPage = () => (
  <Page>
    <PageTitleBar />
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <Stats>
            <Stack distribution="equalSpacing">
              <Stack spacing="tight" vertical>
                <DisplayText size="extraLarge">96</DisplayText>
                <TextStyle variation="strong">
                  <TextStyle variation="subdued">Accepted offers</TextStyle>
                </TextStyle>
              </Stack>
              <Stack spacing="tight" vertical>
                <DisplayText size="extraLarge">$1,214.16</DisplayText>
                <TextStyle variation="strong">
                  <TextStyle variation="subdued">Revenue increase</TextStyle>
                </TextStyle>
              </Stack>
              <Stack spacing="tight" vertical>
                <DisplayText size="extraLarge">3.2%</DisplayText>
                <TextStyle variation="strong">
                  <TextStyle variation="subdued">Conversion rate</TextStyle>
                </TextStyle>
              </Stack>
            </Stack>
          </Stats>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card sectioned>
          <AcceptedOffersChart
            title={
              <Stack distribution="equalSpacing">
                <Heading>Accepted offers</Heading>
                <Button plain url="/analytics">
                  View all analytics
                </Button>
              </Stack>
            }
            subtitle="Offers over last 90 days"
          />
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
