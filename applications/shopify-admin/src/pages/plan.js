import { useState } from 'react';
import styled from 'styled-components';
import {
  Bleed,
  Box,
  Page,
  Layout,
  Card,
  DataTable,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Icon,
  Tooltip
} from '@shopify/polaris';
import { CheckIcon, InfoIcon } from '@shopify/polaris-icons';
import { useShop } from '../hooks';

const PlanTableContainer = styled.div`
  th {
    text-align: center;
    font-weight: bold;
  }
  th:first-of-type {
    text-align: left;
  }
  td {
    text-align: center;
  }
`;

const PlanPage = () => {
  const [changingPlan, setChangingPlan] = useState(false);
  const { shop, changePlan } = useShop();

  const initiatePlanChange = () => {
    setChangingPlan(true);
    changePlan();
  };

  const planData = [
    [
      <Text key="feature1">One-click upsells and cross-sells</Text>,
      <Icon key="1" source={CheckIcon} tone="success" />,
      <Icon key="2" source={CheckIcon} tone="success" />,
      <Icon key="3" source={CheckIcon} tone="success" />,
      <Icon key="4" source={CheckIcon} tone="success" />
    ],
    [
      <Text key="feature2">Post-purchase offers</Text>,
      <Icon key="1" source={CheckIcon} tone="success" />,
      <Icon key="2" source={CheckIcon} tone="success" />,
      <Icon key="3" source={CheckIcon} tone="success" />,
      <Icon key="4" source={CheckIcon} tone="success" />
    ],
    // [
    //   <Text key="feature3">Thank You page offers</Text>,
    //   <Icon key="1" source={CheckIcon} tone="success" />,
    //   <Icon key="2" source={CheckIcon} tone="success" />,
    //   <Icon key="3" source={CheckIcon} tone="success" />,
    //   <Icon key="4" source={CheckIcon} tone="success" />
    // ],
    // [
    //   <Text key="feature3">Order Status page offers</Text>,
    //   <Icon key="1" source={CheckIcon} tone="success" />,
    //   <Icon key="2" source={CheckIcon} tone="success" />,
    //   <Icon key="3" source={CheckIcon} tone="success" />,
    //   <Icon key="4" source={CheckIcon} tone="success" />
    // ],
    [
      <Text key="feature4">Themes</Text>,
      <Icon key="1" source={CheckIcon} tone="success" />,
      <Icon key="2" source={CheckIcon} tone="success" />,
      <Icon key="3" source={CheckIcon} tone="success" />,
      <Icon key="4" source={CheckIcon} tone="success" />
    ],
    [
      <Text key="feature5">Analytics</Text>,
      <Icon key="1" source={CheckIcon} tone="success" />,
      <Icon key="2" source={CheckIcon} tone="success" />,
      <Icon key="3" source={CheckIcon} tone="success" />,
      <Icon key="4" source={CheckIcon} tone="success" />
    ],
    [
      <Text key="feature6">Unlimited offers</Text>,
      <Icon key="1" source={CheckIcon} tone="success" />,
      <Icon key="2" source={CheckIcon} tone="success" />,
      <Icon key="3" source={CheckIcon} tone="success" />,
      <Icon key="4" source={CheckIcon} tone="success" />
    ],
    [
      <Text key="feature7">Unlimited offer views</Text>,
      <Icon key="1" source={CheckIcon} tone="success" />,
      <Icon key="2" source={CheckIcon} tone="success" />,
      <Icon key="3" source={CheckIcon} tone="success" />,
      <Icon key="4" source={CheckIcon} tone="success" />
    ],
    [
      <Text key="feature8">International currency support</Text>,
      <Icon key="1" source={CheckIcon} tone="success" />,
      <Icon key="2" source={CheckIcon} tone="success" />,
      <Icon key="3" source={CheckIcon} tone="success" />,
      <Icon key="4" source={CheckIcon} tone="success" />
    ],
    // [
    //   <Text key="feature9">Customer support</Text>,
    //   <Icon key="1" source={CheckIcon} tone="success" />,
    //   <Icon key="2" source={CheckIcon} tone="success" />,
    //   <Icon key="3" source={CheckIcon} tone="success" />,
    //   <Icon key="4" source={CheckIcon} tone="success" />
    // ],
    [
      <InlineStack key="1">
        <Text>Monthly upsell revenue limit</Text>
        <Text key="feature10">
          <Tooltip content="Analytics are not inflated with original items purchased. Only added items are used to calculate monthly upsell revenue.">
            <Box paddingInlineStart="100">
              <Icon key="1" source={InfoIcon} />
            </Box>
          </Tooltip>
        </Text>
      </InlineStack>,
      <span key="1">Up to $250 USD</span>,
      <span key="2">Up to $1,000 USD</span>,
      <span key="3">Up to $2,000 USD</span>,
      <span key="4">UNLIMITED</span>
    ],
    [
      null,
      <Button
        key="action1"
        primary
        fullWidth
        disabled={(shop?.plan.level === 'FREE' && shop?.plan.active) || changingPlan}
        onClick={() => initiatePlanChange()}
      >
        {shop?.plan.level === 'FREE' && shop?.plan.active ? 'Current plan' : 'Select'}
      </Button>,
      <Button
        key="action1"
        primary
        fullWidth
        disabled={(shop?.plan.level === 'BASIC' && shop?.plan.active) || changingPlan}
        onClick={() => initiatePlanChange()}
      >
        {shop?.plan.level === 'BASIC' && shop?.plan.active ? 'Current plan' : 'Select'}
      </Button>,
      <Button
        key="action2"
        primary
        fullWidth
        disabled={(shop?.plan.level === 'PLUS' && shop?.plan.active) || changingPlan}
        onClick={() => initiatePlanChange()}
      >
        {shop?.plan.level === 'PLUS' && shop?.plan.active ? 'Current plan' : 'Select'}
      </Button>,
      <Button
        key="action3"
        primary
        fullWidth
        disabled={(shop?.plan.level === 'PRO' && shop?.plan.active) || changingPlan}
        onClick={() => initiatePlanChange()}
      >
        {shop?.plan.level === 'PRO' && shop?.plan.active ? 'Current plan' : 'Select'}
      </Button>
    ]
  ];

  return (
    <Page>
      <Layout>
        {!shop?.plan.active && (
          <Layout.Section>
            <BlockStack gap="200" inlineAlign="center">
              <Text variant="heading3xl">Select your plan</Text>
              <Text tone="subdued" variant="headingLg">
                Free 7-day trial. Pay nothing today.
              </Text>
            </BlockStack>
          </Layout.Section>
        )}
        <Layout.Section>
          <Card>
            <Bleed marginBlockStart="200" marginBlockEnd="300">
              <Box padding="400">
                <PlanTableContainer>
                  <DataTable
                    columnContentTypes={['text', 'text', 'text', 'text']}
                    headings={[
                      'Feature',
                      <Text fontWeight="bold" key="free" as="div">
                        <BlockStack>
                          <Text variant="headingLg" as="h2">
                            Free
                          </Text>
                          <Text variant="headingXl">$0/month</Text>
                        </BlockStack>
                      </Text>,
                      <Text fontWeight="bold" key="basic" as="div">
                        <BlockStack>
                          <Text variant="headingLg" as="h2">
                            Basic
                          </Text>
                          <Text variant="headingXl">$24/month</Text>
                        </BlockStack>
                      </Text>,
                      <Text fontWeight="bold" key="plus" as="div">
                        <BlockStack>
                          <Text variant="headingLg" as="h2">
                            Plus
                          </Text>
                          <Text variant="headingXl">$49/month</Text>
                        </BlockStack>
                      </Text>,
                      <Text fontWeight="bold" key="pro" as="div">
                        <BlockStack>
                          <Text variant="headingLg" as="h2">
                            Pro
                          </Text>
                          <Text variant="headingXl">$99/month</Text>
                        </BlockStack>
                      </Text>
                    ]}
                    rows={planData}
                    truncate={false}
                    hoverable={false}
                    verticalAlign="bottom"
                  />
                </PlanTableContainer>
              </Box>
            </Bleed>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default PlanPage;
