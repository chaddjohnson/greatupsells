import { memo, useState, useMemo } from 'react';
import { Loading } from '@shopify/app-bridge-react';
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
  Button,
  Banner,
  TextContainer,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText
} from '@shopify/polaris';
import styled from 'styled-components';
import moment from 'moment-timezone';
import {
  useNumberFormatter,
  useInterval
} from '@neatowebsolutions/upselling-react-hooks';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import { useShop, useShopAcceptances } from '../hooks';
import { TitleBar, LineChart, SkeletonChart } from '../components';

const Stats = styled.div`
  text-align: center;
`;

const TutorialsImage = styled.img`
  display: block;
  width: auto;
  height: auto;
  max-height: 200px;
  margin: 1rem auto;
`;

const PageTitleBar = memo(() => <TitleBar title="Overview dashboard" />);

const loadingComponent = () => (
  <>
    <Loading />
    <SkeletonPage title="Overview dashboard">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText lines={3} />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <SkeletonChart />
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  </>
);

const DashboardPage = () => {
  const [chartStartAt, setChartStartAt] = useState(
    moment().subtract(90, 'days').toDate()
  );
  const [chartEndAt, setChartEndAt] = useState(new Date());
  const [chartDateChanged, setChartDateChanged] = useState(false);

  const { shop, shopLoading, shopError, fetchShop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const {
    formatNumber,
    formatCurrency,
    formatPercentage
  } = useNumberFormatter({ locale, countryCode, currency });
  const {
    shopAcceptances,
    shopAcceptancesLoading,
    shopAcceptancesError,
    fetchShopAcceptances
  } = useShopAcceptances(shop?._id, chartStartAt, chartEndAt);

  const shopAcceptancesChartData = useMemo(
    () =>
      shopAcceptances?.map(({ date, acceptances }) => [
        moment(date).startOf('day').valueOf(),
        acceptances
      ]),
    [shopAcceptances]
  );

  const loading = shopLoading || shopAcceptancesLoading;
  const error = !!shopError || !!shopAcceptancesError;

  const errorComponent = memo(() => (
    <Page title="Overview dashboard">
      <Banner
        title="Unable to load dashboad"
        status="critical"
        action={{
          content: 'Try again',
          onAction: () => window.location.reload()
        }}
      >
        Unable to load offers. Please try again shortly.
      </Banner>
    </Page>
  ));

  // Refresh data at an interval.
  useInterval(() => {
    if (!chartDateChanged) {
      setChartStartAt(moment().subtract(90, 'days').toDate());
      setChartEndAt(new Date());
    }

    fetchShop();
    fetchShopAcceptances();
  }, 30);

  return (
    <Loader
      isLoading={loading}
      isError={error}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page title="Overview dashboard">
        <PageTitleBar />
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Stats>
                <Stack distribution="fillEvenly" alignment="trailing" wrap>
                  <Stack spacing="tight" vertical>
                    <DisplayText size="extraLarge">
                      {formatNumber(shop?.offerAcceptanceCount)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">Accepted offers</TextStyle>
                    </TextStyle>
                  </Stack>
                  <Stack spacing="tight" vertical>
                    <DisplayText size="extraLarge">
                      {formatCurrency(shop?.revenueIncrease)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">
                        Revenue increase
                      </TextStyle>
                    </TextStyle>
                  </Stack>
                  <Stack spacing="tight" vertical>
                    <DisplayText size="extraLarge">
                      {formatPercentage(shop?.offerConversionRate, 1)}
                    </DisplayText>
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
                    <Heading>Accepted offers growth</Heading>
                    <Button plain url="/analytics/">
                      View all analytics
                    </Button>
                  </Stack>
                }
                subtitle="Offers over last 90 days"
                rangeDescription="January to December"
                tooltipText="accepted offers"
                data={shopAcceptancesChartData}
                emptyMessage="No acceptance data available."
                formatters={{
                  number: formatNumber,
                  percentage: formatPercentage
                }}
              />
            </Card>
          </Layout.Section>
          <Layout.Section>
            <CalloutCard
              title="Add upsell, cross-sell, and popup offers to your store"
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
              description="Learn how upselling and cross-selling can boost your sales and revenue."
            >
              <TutorialsImage alt="Tutorials" src="/images/tutorials.svg" />
            </MediaCard>
          </Layout.Section>
        </Layout>
      </Page>
    </Loader>
  );
};

export default DashboardPage;
