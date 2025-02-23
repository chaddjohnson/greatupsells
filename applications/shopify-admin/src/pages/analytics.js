import { memo, useState, useMemo } from 'react';
import { Page, Card, BlockStack, InlineStack, Grid, Text, Banner, SkeletonPage, SkeletonBodyText } from '@shopify/polaris';
import { useNumberFormatter, useCurrency, useDateTime, useInterval } from '@greatupsells/react-hooks';
import { Loader } from '@greatupsells/react-components';
import { useShop, useShopAnalytics } from '../hooks';
import { LineChart, SkeletonChart } from '../components';

const LoadingComponent = () => (
  <SkeletonPage fullWidth>
    <BlockStack gap="400">
      <Card>
        <SkeletonBodyText lines={3} />
      </Card>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
          <Card>
            <SkeletonChart />
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
          <Card>
            <SkeletonChart />
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
          <Card>
            <SkeletonChart />
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
          <Card>
            <SkeletonChart />
          </Card>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
          <Card>
            <SkeletonChart />
          </Card>
        </Grid.Cell>
      </Grid>
    </BlockStack>
  </SkeletonPage>
);

const ErrorComponent = memo(() => (
  <Page fullWidth>
    <Banner
      title="Unable to load analytics"
      tone="critical"
      action={{
        content: 'Try again',
        onAction: () => window.location.reload()
      }}
    >
      Unable to load analytics. Please try again shortly.
    </Banner>
  </Page>
));

const AnalyticsPage = () => {
  const { subtractTime, startOfDay } = useDateTime();
  const [chartStartAt, setChartStartAt] = useState(subtractTime(new Date(), 90, 'days'));
  const [chartEndAt, setChartEndAt] = useState(new Date());
  const [chartDateChanged, setChartDateChanged] = useState(false);
  const [datePickerActive, setDatePickerActive] = useState(false);

  const { shop, shopLoaded, shopError, fetchShop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const { formatNumber, formatPercentage } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });
  const { formatCurrency } = useCurrency({ locale, countryCode, currency });
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
    () => shopAcceptances?.map(({ date, acceptances }) => [startOfDay(date).getTime(), acceptances]),
    [shopAcceptances, startOfDay]
  );
  const shopConversionsChartData = useMemo(
    () => shopConversions?.map(({ date, conversions }) => [startOfDay(date).getTime(), conversions]),
    [shopConversions, startOfDay]
  );
  const shopConversionRatesChartData = useMemo(
    () => shopConversionRates?.map(({ date, conversionRate }) => [startOfDay(date).getTime(), conversionRate]),
    [shopConversionRates, startOfDay]
  );
  const shopRevenueIncreasesChartData = useMemo(
    () => shopRevenueIncreases?.map(({ date, revenueIncrease }) => [startOfDay(date).getTime(), revenueIncrease]),
    [shopRevenueIncreases, startOfDay]
  );
  const shopImpressionsChartData = useMemo(
    () => shopImpressions?.map(({ date, impressions }) => [startOfDay(date).getTime(), impressions]),
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
    <Loader isLoading={!loaded} isError={error} loadingComponent={LoadingComponent} errorComponent={ErrorComponent}>
      <Page title="Analytics" fullWidth>
        <BlockStack gap="400">
          <Card>
            <InlineStack align="space-evenly" gap="400">
              <BlockStack inlineAlign="center" gap="150">
                <Text variant="heading3xl">{formatNumber(shop?.offerImpressionCount)}</Text>
                <Text fontWeight="bold" tone="subdued">
                  Offer impressions
                </Text>
              </BlockStack>
              <BlockStack inlineAlign="center" gap="150">
                <Text variant="heading3xl">{formatNumber(shop?.offerAcceptanceCount)}</Text>
                <Text fontWeight="bold" tone="subdued">
                  Offers accepted
                </Text>
              </BlockStack>
              <BlockStack inlineAlign="center" gap="150">
                <Text variant="heading3xl">{formatPercentage(shop?.offerConversionRate, 1)}</Text>
                <Text fontWeight="bold" tone="subdued">
                  Conversion rate
                </Text>
              </BlockStack>
              <BlockStack inlineAlign="center" gap="150">
                <Text variant="heading3xl">{formatCurrency(shop?.revenueIncrease)}</Text>
                <Text fontWeight="bold" tone="subdued">
                  Revenue increase
                </Text>
              </BlockStack>
            </InlineStack>
          </Card>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
              <Card>
                <LineChart
                  title="Offer impressions"
                  subtitle="Offer impressions over last 90 days"
                  tooltipText="offer impressions"
                  rangeDescription="January to December"
                  data={shopImpressionsChartData}
                  formatters={{ number: formatNumber, percentage: formatPercentage }}
                />
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
              <Card>
                <LineChart
                  title="Conversions"
                  subtitle="Conversions over last 90 days"
                  tooltipText="conversions"
                  rangeDescription="January to December"
                  data={shopConversionsChartData}
                  formatters={{ number: formatNumber, percentage: formatPercentage }}
                />
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
              <Card>
                <LineChart
                  title="Conversion rate"
                  subtitle="Conversion rate over last 90 days"
                  tooltipText="conversion rate"
                  rangeDescription="January to December"
                  data={shopConversionRatesChartData}
                  formatters={{ number: formatPercentage, percentage: formatPercentage }}
                />
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
              <Card>
                <LineChart
                  title="Accepted offers"
                  subtitle="Accepted offers over last 90 days"
                  tooltipText="accepted offers"
                  rangeDescription="January to December"
                  data={shopAcceptancesChartData}
                  formatters={{ number: formatNumber, percentage: formatPercentage }}
                />
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
              <Card>
                <LineChart
                  title="Revenue increase"
                  subtitle="Revenue increase from offers over last 90 days"
                  tooltipText="revenue increase from offers"
                  rangeDescription="January to December"
                  data={shopRevenueIncreasesChartData}
                  formatters={{ number: formatCurrency, percentage: formatPercentage }}
                />
              </Card>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Page>
    </Loader>
  );
};

export default AnalyticsPage;
