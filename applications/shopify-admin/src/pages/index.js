import { memo, useMemo, useState, useCallback } from 'react';
import {
  Page,
  Layout,
  Card,
  InlineGrid,
  Divider,
  Bleed,
  Box,
  Text,
  InlineStack,
  Button,
  Banner,
  MediaCard,
  Tabs,
  DescriptionList,
  BlockStack,
  ProgressBar,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText
} from '@shopify/polaris';
import styled from 'styled-components';
import { useNumberFormatter, useCurrency, useInterval } from '@greatupsells/react-hooks';
import { Loader } from '@greatupsells/react-components';
import { useShop } from '../hooks';
import { Link } from '../components';

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

const LoadingComponent = () => (
  <SkeletonPage>
    <BlockStack gap="400" padding="400">
      <Card>
        <SkeletonBodyText lines={3} />
      </Card>
      <Card>
        <BlockStack gap="400" padding="400">
          <SkeletonDisplayText size="small" />
          <SkeletonBodyText lines={4} />
        </BlockStack>
      </Card>
    </BlockStack>
  </SkeletonPage>
);

const DashboardPage = () => {
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

  const [selectedGettingStartedTabIndex, setSelectedGettingStartedTabIndex] = useState(0);

  const loaded = shopLoaded;
  const error = !!shopError;

  const gettingStartedTabs = [
    {
      id: 'strategies',
      content: 'Strategies',
      panelID: 'strategies-content'
    },
    {
      id: 'trigger-events',
      content: 'Trigger events',
      panelID: 'trigger-events-content'
    }
  ];

  const ErrorComponent = memo(() => (
    <Page title="Overview dashboard">
      <Banner
        title="Unable to load overview dashboard"
        tone="critical"
        action={{
          content: 'Try again',
          onAction: () => window.location.reload()
        }}
      >
        Unable to load overview dashboard. Please try again shortly.
      </Banner>
    </Page>
  ));

  const planUsagePercentage = useMemo(() => {
    if (typeof shop?.plan.monthUpsellRevenueLimit !== 'number') {
      return 0;
    }

    return Math.min(shop?.plan.monthUpsellRevenue / shop?.plan.monthUpsellRevenueLimit, 1);
  }, [shop]);

  const handleTabChange = useCallback((index) => {
    setSelectedGettingStartedTabIndex(index);
  }, []);

  // Refresh data at an interval.
  useInterval(() => {
    fetchShop();
  }, 60);

  return (
    <Loader isLoading={!loaded} isError={error} loadingComponent={LoadingComponent} errorComponent={ErrorComponent}>
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <Bleed marginBlockStart="100">
                <Box paddingBlockEnd="300">
                  <InlineStack align="end">
                    <Button variant="plain" url={'/analytics'}>
                      View analytics
                    </Button>
                  </InlineStack>

                  <InlineStack align="space-evenly">
                    <BlockStack inlineAlign="center" gap="150">
                      <Text variant="heading3xl">{formatNumber(shop?.offerAcceptanceCount)}</Text>
                      <Text fontWeight="bold">Offers accepted</Text>
                    </BlockStack>
                    <BlockStack inlineAlign="center" gap="150">
                      <Text variant="heading3xl">{formatPercentage(shop?.offerConversionRate, 1)}</Text>
                      <Text fontWeight="bold">Conversion rate</Text>
                    </BlockStack>
                    <BlockStack inlineAlign="center" gap="150">
                      <Text variant="heading3xl">{formatCurrency(shop?.revenueIncrease)}</Text>
                      <Text fontWeight="bold">Revenue increase</Text>
                    </BlockStack>
                  </InlineStack>
                </Box>
              </Bleed>
              {shop?.plan.active && (
                <Bleed marginBlockEnd="400" marginInline="400">
                  <Divider />
                  <Box background="bg-surface-secondary" padding="400" paddingBlockEnd="500">
                    <PlanContainer>
                      <BlockStack gap="100">
                        <Text variant="headingMd" as="h2">
                          {shop?.plan.name} plan
                        </Text>
                        {typeof shop?.plan.monthUpsellRevenueLimit === 'number' && (
                          <PlanProgressContainer>
                            <PlanProgressAmount>{formatCurrencyUSD(shop?.plan.monthUpsellRevenue)} USD</PlanProgressAmount>
                            <PlanProgressMeterContainer>
                              <ProgressBar
                                progress={planUsagePercentage * 100 || 0}
                                size="small"
                                tone={planUsagePercentage < 0.8 ? 'highlight' : 'critical'}
                              />
                            </PlanProgressMeterContainer>
                            <PlanProgressAmount>
                              {formatCurrencyUSD(shop?.plan.monthUpsellRevenueLimit)} USD
                            </PlanProgressAmount>
                          </PlanProgressContainer>
                        )}
                        {typeof shop?.plan.monthUpsellRevenueLimit === 'number' && (
                          <Text as="p">
                            You have earned {formatPercentage(planUsagePercentage, 0)} of your plan&apos;s monthly upsell
                            revenue. <Link url="/plan">{planUsagePercentage >= 1 ? 'Upgrade' : 'Manage'} your plan</Link>
                          </Text>
                        )}
                        {typeof shop?.plan.monthUpsellRevenueLimit !== 'number' && (
                          <Text as="p">
                            You have an unlimited monthly upsell revenue allowance with your plan.{' '}
                            <Link url="/plan">Manage your plan</Link>
                          </Text>
                        )}
                      </BlockStack>
                    </PlanContainer>
                  </Box>
                </Bleed>
              )}
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <Text as="h2" variant="headingSm">
                    Add offers to your store
                  </Text>
                  <Button variant="plain" url={'/offers'}>
                    Manage your offers
                  </Button>
                </InlineGrid>
                <BlockStack gap="400">
                  <Text as="p" variant="bodyMd">
                    Upselling and cross-selling are two of the most effective ways to increase sales in your store.
                  </Text>
                  <InlineStack align="start">
                    <Button variant="primary" url="/offers/new/">
                      Create offer
                    </Button>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <MediaCard
              portrait
              title="Getting started"
              description={
                <BlockStack gap="200">
                  <Text as="p">
                    Great Upsells lets you create offers using strategies and trigger events. Read more about these below.
                  </Text>
                  <Box paddingBlockStart="400">
                    <Divider />
                  </Box>
                  <Bleed marginInline="300">
                    <Box paddingBlockStart="200">
                      <Tabs
                        tabs={gettingStartedTabs}
                        selected={selectedGettingStartedTabIndex}
                        fitted
                        onSelect={handleTabChange}
                      >
                        <Box paddingBlock={300} paddingInline={300}>
                          {gettingStartedTabs[selectedGettingStartedTabIndex].id === 'strategies' && (
                            <DescriptionList
                              gap="tight"
                              items={[
                                {
                                  term: 'Cross-sell',
                                  description:
                                    'Encourage customers to purchase a related or complementary product via a popup.'
                                },
                                {
                                  term: 'Upsell',
                                  description:
                                    'Encourage customers to purchase a comparable, more expensive product via a popup.'
                                },
                                {
                                  term: 'Post-purchase offer',
                                  description:
                                    'Encourage customers to purchase a related or complementary product after completing checkout, before the Thank You page. Please review limitations.'
                                },
                                {
                                  term: 'Thank You page offer',
                                  description:
                                    'Encourage customers to purchase a related or complementary product on the Thank You page after completing checkout.'
                                },
                                {
                                  term: 'Order Status page offer',
                                  description:
                                    'Encourage customers to purchase a related or complementary product on the Order Status page.'
                                }
                              ]}
                            />
                          )}
                          {gettingStartedTabs[selectedGettingStartedTabIndex].id === 'trigger-events' && (
                            <DescriptionList
                              gap="tight"
                              items={[
                                {
                                  term: 'Add to cart',
                                  description: 'Offer is shown when a product is added to the cart.'
                                },
                                {
                                  term: 'Page load',
                                  description: 'Offer is shown when the page loads.'
                                },
                                {
                                  term: 'Exit intent',
                                  description:
                                    'Offer is shown on desktop when the mouse is moved above the browser window and on mobile with fast scroll up.'
                                },
                                {
                                  term: 'Lost browser focus',
                                  description:
                                    'Offer is shown when the browser tab fully loses visibility or another browser tab is selected.'
                                },
                                {
                                  term: 'Page scroll',
                                  description:
                                    'Offer is shown when the page is actively scrolled downward beyond a specified threshold.'
                                },
                                {
                                  term: 'Link click',
                                  description:
                                    'Offer is shown when any link is clicked. Links are followed when the popup is closed.                              '
                                }
                              ]}
                            />
                          )}
                        </Box>
                      </Tabs>
                    </Box>
                  </Bleed>
                </BlockStack>
              }
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
