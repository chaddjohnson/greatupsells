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

const OfferAnalyticsPage = () => {
  // TODO: Remove hardcoding.
  const offerId = '5f0f49a53058fb0e19df8358';
  const startAt = new Date('2020-08-01T12:00:00.000+0000');
  const endAt = new Date('2020-08-30T12:00:00.000+0000');

  const [datePickerActive, setDatePickerActive] = useState(false);

  const { shop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const { formatNumber, formatPercentage } = useNumberFormatter(
    locale,
    countryCode,
    currency
  );
  const { offer } = useOffer(offerId);
  const {
    offerAcceptances,
    offerConversions,
    offerConversionRates,
    offerRevenueIncreases,
    offerViews,
    offerAnalyticsLoading,
    offerAnalyticsError,
    fetchAnalytics
  } = useOfferAnalytics(offerId, startAt, endAt);

  const offerAcceptancesChartData = useMemo(
    () =>
      offerAcceptances &&
      offerAcceptances.map(({ date, acceptances }) => [
        new Date(date).getTime(),
        acceptances
      ]),
    [offerAcceptances]
  );
  const offerConversionsChartData = useMemo(
    () =>
      offerConversions &&
      offerConversions.map(({ date, conversions }) => [
        new Date(date).getTime(),
        conversions
      ]),
    [offerConversions]
  );
  const offerConversionRatesChartData = useMemo(
    () =>
      offerConversionRates &&
      offerConversionRates.map(({ date, conversionRate }) => [
        new Date(date).getTime(),
        conversionRate
      ]),
    [offerConversionRates]
  );
  const offerRevenueIncreasesChartData = useMemo(
    () =>
      offerRevenueIncreases &&
      offerRevenueIncreases.map(({ date, revenueIncrease }) => [
        new Date(date).getTime(),
        revenueIncrease
      ]),
    [offerRevenueIncreases]
  );
  const offerViewsChartData = useMemo(
    () =>
      offerViews &&
      offerViews.map(({ date, views }) => [new Date(date).getTime(), views]),
    [offerViews]
  );

  const errorComponent = memo(() => (
    <Page fullWidth>
      <Banner
        title="Unable to load analytics"
        status="critical"
        action={{
          content: 'Try again',
          onAction: fetchAnalytics,
          disabled: offerAnalyticsLoading
        }}
      >
        Unable to load offer. Please try again shortly.
      </Banner>
    </Page>
  ));

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
                  changeValue={formatNumber(85)}
                  changePercentage={formatPercentage(0.01, 1)}
                  data={offerAcceptancesChartData}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Views"
                  subtitle="Views over last 90 days"
                  rangeDescription="January to December"
                  changeValue={formatNumber(214)}
                  changePercentage={formatPercentage(0.115, 1)}
                  data={offerViewsChartData}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Conversion rate"
                  subtitle="Conversion rate over last 90 days"
                  rangeDescription="January to December"
                  changeValue={formatNumber(0.75)}
                  changePercentage={formatPercentage(0.012, 1)}
                  data={offerConversionRatesChartData}
                />
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card sectioned>
                <LineChart
                  title="Revenue increase"
                  subtitle="Revenue increase over last 90 days"
                  rangeDescription="January to December"
                  changeValue={'$364'}
                  changePercentage={0.06}
                  data={offerRevenueIncreasesChartData}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Conversions"
                  subtitle="Conversions over last 90 days"
                  rangeDescription="January to December"
                  changeValue={14}
                  changePercentage={0.04}
                  data={offerConversionsChartData}
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
