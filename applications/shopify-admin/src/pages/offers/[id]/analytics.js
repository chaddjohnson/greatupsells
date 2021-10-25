import { memo, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
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
} from '@greatupsellsreact-hooks';

import { Loader } from '@greatupsellsreact-components';
import { useShop, useOffer, useOfferAnalytics } from '../../../hooks';
import {
  TitleBar,
  LineChart,
  DateRangePicker,
  SkeletonChart
} from '../../../components';

const PageTitleBar = memo(({ offer }) => (
  <TitleBar
    title="Analytics"
    breadcrumbs={[
      { content: 'Offers', url: '/offers/' },
      {
        content: offer?.name,
        url: `/offers/${offer?._id}/`
      }
    ]}
  />
));

const loadingComponent = () => (
  <>
    <Loading />
    <SkeletonPage title="Analytics for offer" fullWidth>
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
  const {
    formatNumber,
    formatCurrency,
    formatPercentage
  } = useNumberFormatter({ locale, countryCode, currency });
  const { offer } = useOffer(offerId);
  const {
    offerAcceptances,
    offerConversions,
    offerConversionRates,
    offerRevenueIncreases,
    offerImpressions,
    offerAnalyticsLoading,
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
      isLoading={offerAnalyticsLoading}
      isError={!!offerAnalyticsError}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page title="Analytics for offer" fullWidth>
        <PageTitleBar offer={offer} />
        <Stack vertical>
          <Stack distribution="equalSpacing">
            <DisplayText size="medium">
              <TextStyle variation="subdued">
                Here&rsquo;s a summary of how your offer is performing
              </TextStyle>
            </DisplayText>
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
                    <DisplayText size="extraLarge">
                      {formatNumber(offer?.impressionCount)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">Impressions</TextStyle>
                    </TextStyle>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <DisplayText size="extraLarge">
                      {formatNumber(offer?.acceptanceCount)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">Acceptances</TextStyle>
                    </TextStyle>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <DisplayText size="extraLarge">
                      {formatCurrency(offer?.revenueIncrease)}
                    </DisplayText>
                    <TextStyle variation="strong">
                      <TextStyle variation="subdued">
                        Revenue increase
                      </TextStyle>
                    </TextStyle>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <DisplayText size="extraLarge">
                      {formatPercentage(offer?.conversionRate, 1)}
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
