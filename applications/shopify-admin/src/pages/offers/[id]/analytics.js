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
  SkeletonPage
} from '@shopify/polaris';
import moment from 'moment-timezone';
import { useNumberFormatter } from '@neatowebsolutions/upselling-react-hooks';
import { Loader } from '@neatowebsolutions/upselling-react-components';
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
  // TODO: Remove hardcoding.
  const offerId = '5f0f49a53058fb0e19df8358';

  const [chartStartAt, setChartStartAt] = useState(
    moment().subtract(90, 'days').toDate()
  );
  const [chartEndAt, setChartEndAt] = useState(new Date());
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
    offerAnalyticsError
  } = useOfferAnalytics(offerId, chartStartAt, chartEndAt);

  const offerAcceptancesChartData = useMemo(
    () =>
      offerAcceptances?.map(({ date, acceptances }) => [
        moment(date).startOf('day').valueOf(),
        acceptances
      ]),
    [offerAcceptances]
  );
  const offerConversionsChartData = useMemo(
    () =>
      offerConversions?.map(({ date, conversions }) => [
        moment(date).startOf('day').valueOf(),
        conversions
      ]),
    [offerConversions]
  );
  const offerConversionRatesChartData = useMemo(
    () =>
      offerConversionRates?.map(({ date, conversionRate }) => [
        moment(date).startOf('day').valueOf(),
        conversionRate
      ]),
    [offerConversionRates]
  );
  const offerRevenueIncreasesChartData = useMemo(
    () =>
      offerRevenueIncreases?.map(({ date, revenueIncrease }) => [
        moment(date).startOf('day').valueOf(),
        revenueIncrease
      ]),
    [offerRevenueIncreases]
  );
  const offerImpressionsChartData = useMemo(
    () =>
      offerImpressions?.map(({ date, impressions }) => [
        moment(date).startOf('day').valueOf(),
        impressions
      ]),
    [offerImpressions]
  );

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
            <DateRangePicker
              active={datePickerActive}
              onActivate={() => setDatePickerActive(!datePickerActive)}
              onClose={() => setDatePickerActive(false)}
            />
          </Stack>
          <Layout>
            <Layout.Section oneHalf>
              <Card sectioned>
                <LineChart
                  title="Acceptances"
                  subtitle="Acceptances over last 90 days"
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
                  title="Impressions"
                  subtitle="Impressions over last 90 days"
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
                  title="Conversion rate"
                  subtitle="Conversion rate over last 90 days"
                  rangeDescription="January to December"
                  data={offerConversionRatesChartData}
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
                  subtitle="Revenue increase over last 90 days"
                  rangeDescription="January to December"
                  data={offerRevenueIncreasesChartData}
                  formatters={{
                    number: formatCurrency,
                    percentage: formatPercentage
                  }}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Conversions"
                  subtitle="Conversions over last 90 days"
                  rangeDescription="January to December"
                  data={offerConversionsChartData}
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

export default OfferAnalyticsPage;
