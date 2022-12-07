import { memo, useState, useMemo } from 'react';
import { Loading } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  CalloutCard,
  MediaCard,
  Stack,
  List,
  Text,
  Button,
  Banner,
  Modal,
  TextContainer,
  ProgressBar,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText
} from '@shopify/polaris';
import styled from 'styled-components';
import {
  useNumberFormatter,
  useCurrency,
  useDateTime,
  useInterval
} from '@greatupsells/react-hooks';
import { Loader } from '@greatupsells/react-components';
import { useShop, useShopAcceptances } from '../hooks';
import { TitleBar, LineChart, SkeletonChart, Link } from '../components';

const PlanContainer = styled.div`
  text-align: center;
`;

const PlanProgressContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: -0.75rem;
  margin-right: -0.75rem;

  > * {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
  }
`;

const PlanProgressMeterContainer = styled.div`
  flex: 1 1 0%;
`;

const PlanProgressAmount = styled.div`
  white-space: nowrap;
  font-weight: 500;
`;

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
      <PageTitleBar />
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
  const [onboardingModalShown, setOnboardingModalShown] = useState(false);

  const { shop, shopLoaded, shopError, fetchShop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const { formatNumber, formatPercentage } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });
  const { formatCurrency } = useCurrency({
    locale,
    countryCode,
    currency,
    options: { decimals: 0 }
  });
  const { formatCurrency: formatCurrencyUSD } = useCurrency({
    locale,
    countryCode,
    currency: 'USD',
    options: { decimals: 0 }
  });
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
      <PageTitleBar />
      <Banner
        title="Unable to load dashboard"
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

  const planUsagePercentage = useMemo(() => {
    if (typeof shop?.plan.monthUpsellRevenueLimit !== 'number') {
      return 0;
    }

    return Math.min(
      shop?.plan.monthUpsellRevenue / shop?.plan.monthUpsellRevenueLimit,
      1
    );
  }, [shop]);

  const handleOnboardingModalClose = async () => {
    setOnboardingModalShown(false);
    await fetchShop();
  };

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
    <Loader
      isLoading={!loaded}
      isError={error}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page title="Overview dashboard">
        <PageTitleBar />
        <Layout>
          {shop && !shop.isEmbedBlockEnabled && (
            <Layout.Section>
              <Banner
                status="warning"
                title="Please enable the &ldquo;Great Upsells Offers&rdquo; app embed"
                action={{
                  content: 'Activate app embed',
                  url: `https://${shop.domain}/admin/themes/current/editor?context=apps&activateAppId=${process.env.SHOPIFY_EMBED_BLOCK_ID}/app-embed`
                }}
                secondaryAction={{
                  content: 'View instructions',
                  onAction: () => setOnboardingModalShown(true)
                }}
              >
                <p>
                  To use this app, you will need to activate the app embed
                  entitled &ldquo;Great Upsells Offers&rdquo; and then save your
                  theme.
                </p>
              </Banner>
              <Modal
                open={onboardingModalShown}
                title="Activation"
                onClose={handleOnboardingModalClose}
              >
                <Modal.Section>
                  <Stack vertical>
                    <TextContainer>
                      <Text variant="headingMd" as="h2">
                        Instructions
                      </Text>
                      <List type="number">
                        <List.Item>
                          Click the &ldquo;Activate app embed&rdquo; button in
                          the banner.
                        </List.Item>
                        <List.Item>
                          Make sure the toggle is on for &ldquo;Great Upsells
                          Offers.&rdquo;
                        </List.Item>
                        <List.Item>Click Save.</List.Item>
                      </List>
                    </TextContainer>
                    <video
                      autoPlay
                      loop
                      style={{ width: '100%', height: 'auto' }}
                    >
                      <source src="/videos/onboarding.mp4" />
                    </video>
                  </Stack>
                </Modal.Section>
              </Modal>
            </Layout.Section>
          )}
          <Layout.Section>
            <Card>
              <Card.Section>
                <Stack distribution="fillEvenly" wrap>
                  <Stack spacing="tight" alignment="center" vertical>
                    <Text variant="heading4xl">
                      {formatNumber(shop?.offerAcceptanceCount)}
                    </Text>
                    <Text fontWeight="bold" color="subdued">
                      Acceptances
                    </Text>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <Text variant="heading4xl">
                      {formatPercentage(shop?.offerConversionRate, 1)}
                    </Text>
                    <Text fontWeight="bold" color="subdued">
                      Conversion rate
                    </Text>
                  </Stack>
                  <Stack spacing="tight" alignment="center" vertical>
                    <Text variant="heading4xl">
                      {formatCurrency(shop?.revenueIncrease)}
                    </Text>
                    <Text fontWeight="bold" color="subdued">
                      Revenue increase
                    </Text>
                  </Stack>
                </Stack>
              </Card.Section>
              {shop?.plan.active && (
                <Card.Section subdued>
                  <PlanContainer>
                    <Stack vertical>
                      <Text variant="headingMd" as="h2">
                        {shop?.plan.name} plan
                      </Text>
                      {typeof shop?.plan.monthUpsellRevenueLimit ===
                        'number' && (
                        <PlanProgressContainer>
                          <PlanProgressAmount>
                            {formatCurrencyUSD(shop?.plan.monthUpsellRevenue)}{' '}
                            USD
                          </PlanProgressAmount>
                          <PlanProgressMeterContainer>
                            <ProgressBar
                              progress={planUsagePercentage * 100 || 0}
                              size="small"
                              color={
                                planUsagePercentage < 0.8
                                  ? 'highlight'
                                  : 'critical'
                              }
                            />
                          </PlanProgressMeterContainer>
                          <PlanProgressAmount>
                            {formatCurrencyUSD(
                              shop?.plan.monthUpsellRevenueLimit
                            )}{' '}
                            USD
                          </PlanProgressAmount>
                        </PlanProgressContainer>
                      )}
                      {typeof shop?.plan.monthUpsellRevenueLimit ===
                        'number' && (
                        <p>
                          You have earned{' '}
                          {formatPercentage(planUsagePercentage, 0)} of your
                          plan&apos;s monthly upsell revenue.{' '}
                          <Link url="/plan">Manage your plan</Link>
                        </p>
                      )}
                      {typeof shop?.plan.monthUpsellRevenueLimit !==
                        'number' && (
                        <p>
                          You have an unlimited monthly upsell revenue allowance
                          with your plan.{' '}
                          <Link url="/plan">Manage your plan</Link>
                        </p>
                      )}
                    </Stack>
                  </PlanContainer>
                </Card.Section>
              )}
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card sectioned>
              <LineChart
                title={
                  <Stack distribution="equalSpacing">
                    <Text variant="headingMd" as="h2">
                      Accepted offers growth
                    </Text>
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
              Upselling and cross-selling are two of the most effective ways to
              increase sales in your store.
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
  );
};

export default DashboardPage;
