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
import { CalendarMajorMonotone } from '@shopify/polaris-icons';
import { useOfferAcceptances } from '@neatowebsolutions/upselling-react-hooks';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import { TitleBar, LineChart, SkeletonChart } from '../../../components';

const data = {
  revenueIncrease: [
    [new Date('6/1/2020').getTime(), 90],
    [new Date('6/2/2020').getTime(), 162],
    [new Date('6/3/2020').getTime(), 153],
    [new Date('6/4/2020').getTime(), 82],
    [new Date('6/5/2020').getTime(), 166],
    [new Date('6/6/2020').getTime(), 100],
    [new Date('6/7/2020').getTime(), 146],
    [new Date('6/8/2020').getTime(), 61],
    [new Date('6/9/2020').getTime(), 163],
    [new Date('6/10/2020').getTime(), 168],
    [new Date('6/11/2020').getTime(), 127],
    [new Date('6/12/2020').getTime(), 1],
    [new Date('6/13/2020').getTime(), 191],
    [new Date('6/14/2020').getTime(), 96],
    [new Date('6/15/2020').getTime(), 1],
    [new Date('6/16/2020').getTime(), 141],
    [new Date('6/17/2020').getTime(), 151],
    [new Date('6/18/2020').getTime(), 167],
    [new Date('6/19/2020').getTime(), 73],
    [new Date('6/20/2020').getTime(), 116],
    [new Date('6/21/2020').getTime(), 193],
    [new Date('6/22/2020').getTime(), 107],
    [new Date('6/23/2020').getTime(), 59],
    [new Date('6/24/2020').getTime(), 21],
    [new Date('6/25/2020').getTime(), 124],
    [new Date('6/26/2020').getTime(), 171],
    [new Date('6/27/2020').getTime(), 11],
    [new Date('6/28/2020').getTime(), 37],
    [new Date('6/29/2020').getTime(), 46],
    [new Date('6/30/2020').getTime(), 82]
  ],
  views: [
    [new Date('6/1/2020').getTime(), 17],
    [new Date('6/2/2020').getTime(), 81],
    [new Date('6/3/2020').getTime(), 188],
    [new Date('6/4/2020').getTime(), 192],
    [new Date('6/5/2020').getTime(), 5],
    [new Date('6/6/2020').getTime(), 193],
    [new Date('6/7/2020').getTime(), 42],
    [new Date('6/8/2020').getTime(), 55],
    [new Date('6/9/2020').getTime(), 112],
    [new Date('6/10/2020').getTime(), 104],
    [new Date('6/11/2020').getTime(), 174],
    [new Date('6/12/2020').getTime(), 175],
    [new Date('6/13/2020').getTime(), 76],
    [new Date('6/14/2020').getTime(), 131],
    [new Date('6/15/2020').getTime(), 30],
    [new Date('6/16/2020').getTime(), 158],
    [new Date('6/17/2020').getTime(), 72],
    [new Date('6/18/2020').getTime(), 147],
    [new Date('6/19/2020').getTime(), 165],
    [new Date('6/20/2020').getTime(), 109],
    [new Date('6/21/2020').getTime(), 100],
    [new Date('6/22/2020').getTime(), 72],
    [new Date('6/23/2020').getTime(), 163],
    [new Date('6/24/2020').getTime(), 137],
    [new Date('6/25/2020').getTime(), 99],
    [new Date('6/26/2020').getTime(), 165],
    [new Date('6/27/2020').getTime(), 126],
    [new Date('6/28/2020').getTime(), 173],
    [new Date('6/29/2020').getTime(), 172],
    [new Date('6/30/2020').getTime(), 93]
  ],
  conversions: [
    [new Date('6/1/2020').getTime(), 171],
    [new Date('6/2/2020').getTime(), 195],
    [new Date('6/3/2020').getTime(), 124],
    [new Date('6/4/2020').getTime(), 27],
    [new Date('6/5/2020').getTime(), 107],
    [new Date('6/6/2020').getTime(), 124],
    [new Date('6/7/2020').getTime(), 104],
    [new Date('6/8/2020').getTime(), 53],
    [new Date('6/9/2020').getTime(), 92],
    [new Date('6/10/2020').getTime(), 185],
    [new Date('6/11/2020').getTime(), 168],
    [new Date('6/12/2020').getTime(), 146],
    [new Date('6/13/2020').getTime(), 59],
    [new Date('6/14/2020').getTime(), 25],
    [new Date('6/15/2020').getTime(), 117],
    [new Date('6/16/2020').getTime(), 144],
    [new Date('6/17/2020').getTime(), 180],
    [new Date('6/18/2020').getTime(), 41],
    [new Date('6/19/2020').getTime(), 96],
    [new Date('6/20/2020').getTime(), 59],
    [new Date('6/21/2020').getTime(), 117],
    [new Date('6/22/2020').getTime(), 69],
    [new Date('6/23/2020').getTime(), 10],
    [new Date('6/24/2020').getTime(), 95],
    [new Date('6/25/2020').getTime(), 68],
    [new Date('6/26/2020').getTime(), 99],
    [new Date('6/27/2020').getTime(), 71],
    [new Date('6/28/2020').getTime(), 74],
    [new Date('6/29/2020').getTime(), 92],
    [new Date('6/30/2020').getTime(), 16]
  ]
};

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
  const [datePickerActive, setDatePickerActive] = useState(false);

  const offerId = '5f0f49a53058fb0e19df8358';
  const startAt = new Date(Date.now() - 60 * 60 * 24 * 30 * 1000);
  const endAt = new Date(Date.now());

  const {
    offerAcceptances,
    offerAcceptancesLoading,
    offerAcceptancesError,
    fetchOfferAcceptances
  } = useOfferAcceptances(offerId, startAt, endAt);

  const offerAcceptancesChartData = useMemo(
    () =>
      offerAcceptances &&
      offerAcceptances.map(({ date, acceptances }) => [
        new Date(date).getTime(),
        acceptances
      ]),
    [offerAcceptances]
  );

  const handleTryAgain = () => {
    if (offerAcceptancesError) {
      fetchOfferAcceptances();
    }
  };

  const offer = {
    _id: '5f0f49a53058fb0e19df8358',
    name: 'Buy one get 10% off'
  };

  const PageTitleBar = memo(() => (
    <TitleBar
      title="Analytics"
      breadcrumbs={[
        { content: 'Offers', url: '/offers/' },
        {
          content: offer.name,
          url: `/offers/${offer._id}/`
        }
      ]}
    />
  ));

  const errorComponent = memo(() => (
    <Page fullWidth>
      <Banner
        title="Unable to load analytics"
        status="critical"
        action={{
          content: 'Try again',
          onAction: handleTryAgain
        }}
      >
        Unable to load offer. Please try again shortly.
      </Banner>
    </Page>
  ));

  return (
    <Loader
      isLoading={offerAcceptancesLoading}
      isError={!!offerAcceptancesError}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page title="Analytics for offer" fullWidth>
        <PageTitleBar />
        <Stack vertical>
          <Stack distribution="equalSpacing">
            <DisplayText size="medium">
              <TextStyle variation="subdued">
                Here&rsquo;s a summary of how your offer is performing
              </TextStyle>
            </DisplayText>
            <Popover
              active={datePickerActive}
              activator={
                <Button
                  size="slim"
                  disclosure
                  icon={CalendarMajorMonotone}
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
                {!offerAcceptancesLoading && (
                  <LineChart
                    title="Acceptances"
                    subtitle="Acceptances over last 90 days"
                    rangeDescription="January to December"
                    changeValue={85}
                    changePercentage={0.01}
                    data={offerAcceptancesChartData}
                  />
                )}
              </Card>
              <Card sectioned>
                <LineChart
                  title="Views"
                  subtitle="Views over last 90 days"
                  rangeDescription="January to December"
                  changeValue={214}
                  changePercentage={0.115}
                  data={data.views}
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
                  data={data.revenueIncrease}
                />
              </Card>
              <Card sectioned>
                <LineChart
                  title="Conversion rate"
                  subtitle="Conversion rate over last 90 days"
                  rangeDescription="January to December"
                  changeValue={14}
                  changePercentage={0.04}
                  data={data.conversions}
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
