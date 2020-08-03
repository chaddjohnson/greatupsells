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
import { TitleBar, LineChart } from '../components';

const Stats = styled.div`
  text-align: center;
`;

const PageTitleBar = memo(() => <TitleBar title="Overview dashboard" />);

const data = {
  acceptedOffers: [
    [new Date('6/1/2020').getTime(), 91],
    [new Date('6/2/2020').getTime(), 33],
    [new Date('6/3/2020').getTime(), 72],
    [new Date('6/4/2020').getTime(), 35],
    [new Date('6/5/2020').getTime(), 187],
    [new Date('6/6/2020').getTime(), 180],
    [new Date('6/7/2020').getTime(), 160],
    [new Date('6/8/2020').getTime(), 21],
    [new Date('6/9/2020').getTime(), 101],
    [new Date('6/10/2020').getTime(), 113],
    [new Date('6/11/2020').getTime(), 97],
    [new Date('6/12/2020').getTime(), 43],
    [new Date('6/13/2020').getTime(), 30],
    [new Date('6/14/2020').getTime(), 75],
    [new Date('6/15/2020').getTime(), 87],
    [new Date('6/16/2020').getTime(), 118],
    [new Date('6/17/2020').getTime(), 159],
    [new Date('6/18/2020').getTime(), 180],
    [new Date('6/19/2020').getTime(), 146],
    [new Date('6/20/2020').getTime(), 166],
    [new Date('6/21/2020').getTime(), 192],
    [new Date('6/22/2020').getTime(), 116],
    [new Date('6/23/2020').getTime(), 193],
    [new Date('6/24/2020').getTime(), 121],
    [new Date('6/25/2020').getTime(), 28],
    [new Date('6/26/2020').getTime(), 83],
    [new Date('6/27/2020').getTime(), 66],
    [new Date('6/28/2020').getTime(), 66],
    [new Date('6/29/2020').getTime(), 7],
    [new Date('6/30/2020').getTime(), 171]
  ]
};

const DashboardPage = () => (
  <Page title="Overview dashboard">
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
          <LineChart
            title={
              <Stack distribution="equalSpacing">
                <Heading>Accepted offers</Heading>
                <Button plain url="/analytics/">
                  View all analytics
                </Button>
              </Stack>
            }
            subtitle="Offers over last 90 days"
            rangeDescription="January to December"
            changeValue={85}
            changePercentage={0.01}
            tooltipText="accepted offers"
            data={data.acceptedOffers}
          />
        </Card>
      </Layout.Section>
      <Layout.Section>
        <CalloutCard
          title="Add upsell and cross-sell offers to your store"
          primaryAction={{
            content: 'Create offer',
            url: '/offers/new/'
          }}
          secondaryAction={{
            content: 'Manage your offers',
            url: '/offers/'
          }}
        >
          Upselling and cross-selling are two of the most effective ways to
          increase sales in your store.
        </CalloutCard>
        <MediaCard
          title="Getting Started"
          primaryAction={{
            content: 'Visit the tutorials',
            url: 'https://help.domain.com/tutorials'
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

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default DashboardPage;
