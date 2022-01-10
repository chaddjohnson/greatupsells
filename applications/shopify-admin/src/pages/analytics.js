import { memo, useState, useMemo } from 'react';
import { Loading } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  Stack,
  DisplayText,
  TextStyle,
  Banner,
  SkeletonPage,
  SkeletonBodyText
} from '@shopify/polaris';
import {
  useNumberFormatter,
  useDateTime,
  useInterval
} from '@greatupsells/react-hooks';
import { Loader } from '@greatupsells/react-components';
import { useShop, useShopAnalytics } from '../hooks';
import { TitleBar, LineChart, SkeletonChart } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Analytics" />);

const loadingComponent = () => (
  <>
    <Loading />
    <SkeletonPage title="Analytics for offer" fullWidth>
      <Stack vertical>
        <DisplayText size="medium">
          <TextStyle variation="subdued">
            Here&rsquo;s a summary of how your offers are performing
          </TextStyle>
        </DisplayText>
        <Layout>
          <Layout.Section fullWidth>
            <Card sectioned>
              <SkeletonBodyText lines={3} />
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card sectioned>
              <SkeletonChart />
            </Card>
            <Card sectioned>
              <SkeletonChart />
            </Card>
            <Card sectioned>
              <SkeletonChart />
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card sectioned>
              <SkeletonChart />
            </Card>
            <Card sectioned>
              <SkeletonChart />
            </Card>
          </Layout.Section>
        </Layout>
      </Stack>
    </SkeletonPage>
  </>
);

const errorComponent = memo(() => (
  <Page fullWidth>
    <Banner
      title="Unable to load analytics"
      status="critical"
      action={{
        content: 'Try again',
        onAction: () => window.location.reload()
      }}
    >
      Unable to load offer. Please try again shortly.
    </Banner>
  </Page>
));

const AnalyticsPage = () => {
  const { subtractTime, startOfDay } = useDateTime();
  const [chartStartAt, setChartStartAt] = useState(
    subtractTime(new Date(), 90, 'days')
  );
  const [chartEndAt, setChartEndAt] = useState(new Date());
  const [chartDateChanged, setChartDateChanged] = useState(false);
  const [datePickerActive, setDatePickerActive] = useState(false);

  const { shop, shopLoaded, shopError, fetchShop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const {
    formatNumber,
    formatCurrency,
    formatPercentage
  } = useNumberFormatter({ locale, countryCode, currency });
  const {
    shopAcceptances,
    shopConversions,
    shopConversionRates,
    shopRevenueIncreases,
    shopImpressions,
    shopAnalyticsLoaded,
    shopAnalyticsError,
    fetchShopAnalytics
  } = useShopAnalytics(shop?._id, chartStartAt, chartEndAt);

  const shopAcceptancesChartData = useMemo(
    () =>
      shopAcceptances?.map(({ date, acceptances }) => [
        startOfDay(date).getTime(),
        acceptances
      ]),
    [shopAcceptances, startOfDay]
  );
  const shopConversionsChartData = useMemo(
    () =>
      shopConversions?.map(({ date, conversions }) => [
        startOfDay(date).getTime(),
        conversions
      ]),
    [shopConversions, startOfDay]
  );
  const shopConversionRatesChartData = useMemo(
    () =>
      shopConversionRates?.map(({ date, conversionRate }) => [
        startOfDay(date).getTime(),
        conversionRate
      ]),
    [shopConversionRates, startOfDay]
  );
  const shopRevenueIncreasesChartData = useMemo(
    () =>
      shopRevenueIncreases?.map(({ date, revenueIncrease }) => [
        startOfDay(date).getTime(),
        revenueIncrease
      ]),
    [shopRevenueIncreases, startOfDay]
  );
  const shopImpressionsChartData = useMemo(
    () =>
      shopImpressions?.map(({ date, impressions }) => [
        startOfDay(date).getTime(),
        impressions
      ]),
    [shopImpressions, startOfDay]
  );

  const loaded = shopLoaded && shopAnalyticsLoaded;
  const error = !!shopError || !!shopAnalyticsError;

  // Refresh data at an interval.
  useInterval(() => {
    if (!chartDateChanged) {
      setChartStartAt(subtractTime(new Date(), 90, 'days'));
      setChartEndAt(new Date());
    }

    fetchShop();
    fetchShopAnalytics();
  }, 60);

  return (
    <Loader
      isLoading={!loaded}
      isError={error}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page title="Analytics for all offers" fullWidth>
        <PageTitleBar />
        <Stack vertical>
          <Stack distribution="equalSpacing">
            <DisplayText size="medium">
              <TextStyle variation="subdued">
                Here&rsquo;s a summary of how your offers are performing
              </TextStyle>
            </DisplayText>
            {/* <Popover
              active={datePickerActive}
              activator={
                <Button
                  size="slim"
                  disclosure
                  icon={CalendarMajor}
                  onClick={() => setDatePickerActive(!datePickerActive)}
                >
                  Last 90 days
                </Button>
              }
              onClose={() => setDatePickerActive(false)}
            >
              Date picker here
            </Popover> */}
          </Stack>
          <Layout>
            <Layout.Section fullWidth>
              <Card sectioned>
                <Stack distribution="fillEvenly" wrap>
                  <Stack spacing="tight" alignment="center" vertical>
                    <DisplayText size="extraLarge">
                      {formatNumber(shop?.offerImpressionCount)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">Impressions</TextStyle>
                    </TextStyle>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <DisplayText size="extraLarge">
                      {formatNumber(shop?.offerAcceptanceCount)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">Acceptances</TextStyle>
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
            <Layout.Section oneHalf>
              <Card sectioned>
                <LineChart
                  title="Offer impressions growth"
                  subtitle="Offer impressions over last 90 days"
                  tooltipText="offer impressions"
                  rangeDescription="January to December"
                  data={shopImpressionsChartData}
                  formatters={{
                    number: formatNumber,
                    percentage: formatPercentage
                  }}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Conversions growth"
                  subtitle="Conversions over last 90 days"
                  tooltipText="conversions"
                  rangeDescription="January to December"
                  data={shopConversionsChartData}
                  formatters={{
                    number: formatNumber,
                    percentage: formatPercentage
                  }}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Conversion rate growth"
                  subtitle="Conversion rate over last 90 days"
                  tooltipText="conversion rate"
                  rangeDescription="January to December"
                  data={shopConversionRatesChartData}
                  formatters={{
                    number: formatPercentage,
                    percentage: formatPercentage
                  }}
                />
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card sectioned>
                <LineChart
                  title="Accepted offers growth"
                  subtitle="Accepted offers over last 90 days"
                  tooltipText="accepted offers"
                  rangeDescription="January to December"
                  data={shopAcceptancesChartData}
                  formatters={{
                    number: formatNumber,
                    percentage: formatPercentage
                  }}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Revenue increase growth"
                  subtitle="Revenue increase from offers over last 90 days"
                  tooltipText="revenue increase from offers"
                  rangeDescription="January to December"
                  data={shopRevenueIncreasesChartData}
                  formatters={{
                    number: formatCurrency,
                    percentage: formatPercentage
                  }}
                />
              </Card>
            </Layout.Section>
          </Layout>
        </Stack>
      </Page>
    </Loader>
  );
};

export default AnalyticsPage;
