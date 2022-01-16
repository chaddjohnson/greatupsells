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
import {
  useNumberFormatter,
  useDateTime,
  useInterval
} from '@greatupsells/react-hooks';
import { Loader } from '@greatupsells/react-components';
import { useShop, useShopAcceptances } from '../hooks';
import { TitleBar, LineChart, SkeletonChart } from '../components';

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
  const { subtractTime, startOfDay } = useDateTime();
  const [chartStartAt, setChartStartAt] = useState(
    subtractTime(new Date(), 90, 'days')
  );
  const [chartEndAt, setChartEndAt] = useState(new Date());
  const [chartDateChanged, setChartDateChanged] = useState(false);

  const { shop, shopLoaded, shopError, fetchShop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const {
    formatNumber,
    formatCurrency,
    formatPercentage
  } = useNumberFormatter({ locale, countryCode, currency });
  const {
    shopAcceptances,
    shopAcceptancesLoaded,
    shopAcceptancesError,
    fetchShopAcceptances
  } = useShopAcceptances(shop?._id, chartStartAt, chartEndAt);

  const shopAcceptancesChartData = useMemo(
    () =>
      shopAcceptances?.map(({ date, acceptances }) => [
        startOfDay(date).getTime(),
        acceptances
      ]),
    [shopAcceptances, startOfDay]
  );

  const loaded = shopLoaded && shopAcceptancesLoaded;
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
      setChartStartAt(subtractTime(new Date(), 90, 'days'));
      setChartEndAt(new Date());
    }

    fetchShop();
    fetchShopAcceptances();
  }, 60);

  return (
    <>
      <PageTitleBar />
      <Loader
        isLoading={!loaded}
        isError={error}
        loadingComponent={loadingComponent}
        errorComponent={errorComponent}
      >
        <Page title="Overview dashboard">
          <Layout>
            <Layout.Section>
              <Card sectioned>
                <Stack distribution="fillEvenly" wrap>
                  <Stack spacing="tight" alignment="center" vertical>
                    <DisplayText size="extraLarge">
                      {formatNumber(shop?.offerAcceptanceCount)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">Accepted offers</TextStyle>
                    </TextStyle>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <DisplayText size="extraLarge">
                      {formatCurrency(shop?.revenueIncrease)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">
                        Revenue increase
                      </TextStyle>
                    </TextStyle>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <DisplayText size="extraLarge">
                      {formatPercentage(shop?.offerConversionRate, 1)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">Conversion rate</TextStyle>
                    </TextStyle>
                  </Stack>
                </Stack>
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
                Upselling and cross-selling are two of the most effective ways
                to increase sales in your store.
              </CalloutCard>
              <MediaCard
                title="Getting Started"
                primaryAction={{
                  content: 'Visit the tutorials',
                  url: 'https://help.domain.com/tutorials'
                }}
                description="Learn how upselling and cross-selling can boost your sales and revenue."
              >
                <TutorialsImage alt="Tutorials" src={`/images/tutorials.svg`} />
              </MediaCard>
            </Layout.Section>
          </Layout>
        </Page>
      </Loader>
    </>
  );
};

export default DashboardPage;
