import { memo, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Page, Card, BlockStack, InlineStack, Grid, Text, Banner, SkeletonPage, SkeletonBodyText } from '@shopify/polaris';
import { useNumberFormatter, useCurrency, useDateTime, useInterval } from '@greatupsells/react-hooks';
import { Loader } from '@greatupsells/react-components';
import { useShop, useOffer, useOfferAnalytics } from '../../../hooks';
import { TitleBar, LineChart, SkeletonChart } from '../../../components';

const PageTitleBar = memo(({ offer }) => {
  // Include `shop` as a URL parameter to internal links to allow links to be opened in new tabs.
  const urlParams = sessionStorage.shop ? `?shop=${sessionStorage.shop}` : '';

  return (
    <TitleBar title="Offer analytics">
      <a variant="breadcrumb" href={`/offers/${offer._id}/${urlParams}`}>
        {offer.name}
      </a>
    </TitleBar>
  );
});

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
    <PageTitleBar />
    <Banner
      title="Unable to load analytics"
      tone="critical"
      action={{
        content: 'Try again',
        onAction: () => window.location.reload()
      }}
    >
      Unable to load offer. Please try again shortly.
    </Banner>
  </Page>
));

const OfferAnalyticsPage = () => {
  const router = useRouter();
  const offerId = router.query.id;

  const { startOfDay, subtractTime } = useDateTime();

  const [chartStartAt, setChartStartAt] = useState(subtractTime(new Date(), 90, 'days'));
  const [chartEndAt, setChartEndAt] = useState(new Date());
  const [chartDateChanged, setChartDateChanged] = useState(false);
  const [datePickerActive, setDatePickerActive] = useState(false);

  const { shop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const { formatNumber, formatPercentage } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });
  const { formatCurrency } = useCurrency({ locale, countryCode, currency });
  const { offer } = useOffer(offerId);
  const {
    offerAcceptances,
    offerConversions,
    offerConversionRates,
    offerRevenueIncreases,
    offerImpressions,
    offerAnalyticsLoaded,
    offerAnalyticsError,
    fetchOfferAnalytics
  } = useOfferAnalytics(offerId, chartStartAt, chartEndAt);

  const offerAcceptancesChartData = useMemo(
    () => offerAcceptances?.map(({ date, acceptances }) => [startOfDay(date).getTime(), acceptances]),
    [offerAcceptances, startOfDay]
  );
  const offerConversionsChartData = useMemo(
    () => offerConversions?.map(({ date, conversions }) => [startOfDay(date).getTime(), conversions]),
    [offerConversions, startOfDay]
  );
  const offerConversionRatesChartData = useMemo(
    () => offerConversionRates?.map(({ date, conversionRate }) => [startOfDay(date).getTime(), conversionRate]),
    [offerConversionRates, startOfDay]
  );
  const offerRevenueIncreasesChartData = useMemo(
    () => offerRevenueIncreases?.map(({ date, revenueIncrease }) => [startOfDay(date).getTime(), revenueIncrease]),
    [offerRevenueIncreases, startOfDay]
  );
  const offerImpressionsChartData = useMemo(
    () => offerImpressions?.map(({ date, impressions }) => [startOfDay(date).getTime(), impressions]),
    [offerImpressions, startOfDay]
  );

  // Refresh data at an interval.
  useInterval(() => {
    if (!chartDateChanged) {
      setChartStartAt(subtractTime(new Date(), 90, 'days'));
      setChartEndAt(new Date());
    }

    fetchOfferAnalytics();
  }, 60);

  return (
    <Loader
      isLoading={!offerAnalyticsLoaded}
      isError={!!offerAnalyticsError}
      loadingComponent={LoadingComponent}
      errorComponent={ErrorComponent}
    >
      <Page fullWidth>
        <PageTitleBar offer={offer} />
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
                  tooltipText="impressions"
                  rangeDescription="January to December"
                  data={offerImpressionsChartData}
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
                  data={offerConversionsChartData}
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
                  data={offerConversionRatesChartData}
                  formatters={{ number: formatPercentage, percentage: formatPercentage }}
                />
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 6, xl: 4 }}>
              <Card>
                <LineChart
                  title="Offer acceptances"
                  subtitle="Offers accepted over last 90 days"
                  tooltipText="offers accepted"
                  rangeDescription="January to December"
                  data={offerAcceptancesChartData}
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
                  data={offerRevenueIncreasesChartData}
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

export default OfferAnalyticsPage;
