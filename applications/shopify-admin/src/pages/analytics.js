import { memo, useState, useMemo } from 'react';
import { Loading } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  Stack,
  Popover,
  Button,
  DisplayText,
  TextStyle,
  Banner,
  SkeletonPage
} from '@shopify/polaris';
import { CalendarMajor } from '@shopify/polaris-icons';
import moment from 'moment-timezone';
import {
  useNumberFormatter,
  useInterval
} from '@neatowebsolutions/upselling-react-hooks';
import { Loader } from '@neatowebsolutions/upselling-react-components';
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
  const [chartStartAt, setChartStartAt] = useState(
    moment().subtract(90, 'days').toDate()
  );
  const [chartEndAt, setChartEndAt] = useState(new Date());
  const [datePickerActive, setDatePickerActive] = useState(false);

  const { shop, shopLoading, shopError, fetchShop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const {
    formatNumber,
    formatCurrency,
    formatPercentage
  } = useNumberFormatter({ locale, countryCode, currency });
  const {
    shopAcceptances,
    shopConversions,
    // shopConversionRates,
    shopRevenueIncreases,
    shopImpressions,
    shopAnalyticsLoading,
    shopAnalyticsError,
    fetchShopAnalytics
  } = useShopAnalytics(shop?._id, chartStartAt, chartEndAt);

  const shopAcceptancesChartData = useMemo(
    () =>
      shopAcceptances?.map(({ date, acceptances }) => [
        moment(date).startOf('day').valueOf(),
        acceptances
      ]),
    [shopAcceptances]
  );
  const shopConversionsChartData = useMemo(
    () =>
      shopConversions?.map(({ date, conversions }) => [
        moment(date).startOf('day').valueOf(),
        conversions
      ]),
    [shopConversions]
  );
  // const shopConversionRatesChartData = useMemo(
  //   () =>
  //     shopConversionRates?.map(({ date, conversionRate }) => [
  //       moment(date).startOf('day').valueOf(),
  //       conversionRate
  //     ]),
  //   [shopConversionRates]
  // );
  const shopRevenueIncreasesChartData = useMemo(
    () =>
      shopRevenueIncreases?.map(({ date, revenueIncrease }) => [
        moment(date).startOf('day').valueOf(),
        revenueIncrease
      ]),
    [shopRevenueIncreases]
  );
  const shopImpressionsChartData = useMemo(
    () =>
      shopImpressions?.map(({ date, impressions }) => [
        moment(date).startOf('day').valueOf(),
        impressions
      ]),
    [shopImpressions]
  );

  const loading = shopLoading || shopAnalyticsLoading;
  const error = !!shopError || !!shopAnalyticsError;

  // Refresh data at an interval.
  useInterval(() => {
    fetchShop();
    fetchShopAnalytics();
  }, 30);

  return (
    <Loader
      isLoading={loading}
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
            <Popover
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
            </Popover>
          </Stack>
          <Layout>
            <Layout.Section oneHalf>
              <Card sectioned>
                <LineChart
                  title="Accepted offers"
                  subtitle="Accepted offers over last 90 days"
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
                  title="Offer impressions"
                  subtitle="Offer impressions over last 90 days"
                  rangeDescription="January to December"
                  data={shopImpressionsChartData}
                  formatters={{
                    number: formatNumber,
                    percentage: formatPercentage
                  }}
                />
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card sectioned>
                <LineChart
                  title="Revenue increase"
                  subtitle="Revenue increase from offers over last 90 days"
                  rangeDescription="January to December"
                  data={shopRevenueIncreasesChartData}
                  formatters={{
                    number: formatCurrency,
                    percentage: formatPercentage
                  }}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Conversion rate"
                  subtitle="Conversion rate over last 90 days"
                  rangeDescription="January to December"
                  data={shopConversionsChartData}
                  formatters={{
                    number: formatNumber,
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
