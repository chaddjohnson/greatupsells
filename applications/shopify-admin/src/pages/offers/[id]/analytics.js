import { memo, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  Stack,
  Text,
  Banner,
  SkeletonPage,
  SkeletonBodyText
} from '@shopify/polaris';
import {
  useNumberFormatter,
  useCurrency,
  useDateTime,
  useInterval
} from '@greatupsells/react-hooks';

import { Loader } from '@greatupsells/react-components';
import { useShop, useOffer, useOfferAnalytics } from '../../../hooks';
import { TitleBar, LineChart, SkeletonChart } from '../../../components';

const PageTitleBar = memo(({ offer }) => (
  <TitleBar
    title="Analytics"
    breadcrumbs={[
      { content: 'Offers', url: '/offers/' },
      offer && {
        content: offer?.name,
        url: `/offers/${offer?._id}/`
      }
    ].filter(Boolean)}
  />
));

const loadingComponent = () => (
  <>
    <Loading />
    <SkeletonPage title="Analytics for offer" fullWidth>
      <PageTitleBar />
      <Stack vertical>
        <Text as="h3" color="subdued" fontWeight="regular" variant="heading2xl">
          Here&rsquo;s a summary of how your offer is performing
        </Text>
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
    <PageTitleBar />
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

const OfferAnalyticsPage = () => {
  const router = useRouter();
  const offerId = router.query.id;

  const { startOfDay, subtractTime } = useDateTime();

  const [chartStartAt, setChartStartAt] = useState(
    subtractTime(new Date(), 90, 'days')
  );
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
    () =>
      offerAcceptances?.map(({ date, acceptances }) => [
        startOfDay(date).getTime(),
        acceptances
      ]),
    [offerAcceptances, startOfDay]
  );
  const offerConversionsChartData = useMemo(
    () =>
      offerConversions?.map(({ date, conversions }) => [
        startOfDay(date).getTime(),
        conversions
      ]),
    [offerConversions, startOfDay]
  );
  const offerConversionRatesChartData = useMemo(
    () =>
      offerConversionRates?.map(({ date, conversionRate }) => [
        startOfDay(date).getTime(),
        conversionRate
      ]),
    [offerConversionRates, startOfDay]
  );
  const offerRevenueIncreasesChartData = useMemo(
    () =>
      offerRevenueIncreases?.map(({ date, revenueIncrease }) => [
        startOfDay(date).getTime(),
        revenueIncrease
      ]),
    [offerRevenueIncreases, startOfDay]
  );
  const offerImpressionsChartData = useMemo(
    () =>
      offerImpressions?.map(({ date, impressions }) => [
        startOfDay(date).getTime(),
        impressions
      ]),
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
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page title="Analytics for offer" fullWidth>
        <PageTitleBar offer={offer} />
        <Stack vertical>
          <Stack distribution="equalSpacing">
            <Text
              as="h3"
              color="subdued"
              fontWeight="regular"
              variant="heading2xl"
            >
              Here&rsquo;s a summary of how your offer is performing
            </Text>
            {/* <DateRangePicker
              active={datePickerActive}
              onActivate={() => setDatePickerActive(!datePickerActive)}
              onClose={() => setDatePickerActive(false)}
            /> */}
          </Stack>
          <Layout>
            <Layout.Section fullWidth>
              <Card sectioned>
                <Stack distribution="fillEvenly" wrap>
                  <Stack spacing="tight" alignment="center" vertical>
                    <Text variant="heading4xl">
                      {formatNumber(offer?.impressionCount)}
                    </Text>
                    <Text fontWeight="bold" color="subdued">
                      Impressions
                    </Text>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <Text variant="heading4xl">
                      {formatNumber(offer?.acceptanceCount)}
                    </Text>
                    <Text fontWeight="bold" color="subdued">
                      Acceptances
                    </Text>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <Text variant="heading4xl">
                      {formatPercentage(offer?.conversionRate, 1)}
                    </Text>
                    <Text fontWeight="bold" color="subdued">
                      Conversion rate
                    </Text>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <Text variant="heading4xl">
                      {formatCurrency(offer?.revenueIncrease)}
                    </Text>
                    <Text fontWeight="bold" color="subdued">
                      Revenue increase
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card sectioned>
                <LineChart
                  title="Impressions growth"
                  subtitle="Impressions over last 90 days"
                  tooltipText="impressions"
                  rangeDescription="January to December"
                  data={offerImpressionsChartData}
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
                  data={offerConversionsChartData}
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
                  data={offerConversionRatesChartData}
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
                  title="Acceptances growth"
                  subtitle="Acceptances over last 90 days"
                  tooltipText="acceptances"
                  rangeDescription="January to December"
                  data={offerAcceptancesChartData}
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
                  data={offerRevenueIncreasesChartData}
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

export default OfferAnalyticsPage;
