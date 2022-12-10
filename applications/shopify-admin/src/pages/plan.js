import { memo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  Page,
  Breadcrumbs,
  Layout,
  Card,
  DataTable,
  Text,
  Button,
  TextContainer,
  Icon,
  Stack
} from '@shopify/polaris';
import { TickMinor } from '@shopify/polaris-icons';
import { TitleBar } from '../components';
import { useShop } from '../hooks';

const PlanTableContainer = styled.div`
  th {
    text-align: center;
  }
  th:first-of-type {
    text-align: left;
  }
  td {
    text-align: center;
  }
`;

const PageTitleBar = memo(() => <TitleBar title="Plan" />);

const PlanPage = () => {
  const router = useRouter();
  const { charge_id: chargeId } = router.query;

  const [changingPlan, setChangingPlan] = useState(false);
  const [activatingPlan, setActivatingPlan] = useState(false);

  const { shop, changePlan, activatePlan } = useShop();

  const initiatePlanChange = async (level) => {
    setChangingPlan(true);
    await changePlan(level);
  };

  const planData = [
    [
      <Text key="feature1" fontWeight="bold">
        One-click upsells and cross-sells
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature2" fontWeight="bold">
        Post-purchase offers
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature3" fontWeight="bold">
        Thank You page offers
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature3" fontWeight="bold">
        Order Status page offers
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature4" fontWeight="bold">
        Themes
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature5" fontWeight="bold">
        Analytics
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature6" fontWeight="bold">
        Unlimited offers
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature7" fontWeight="bold">
        Unlimited offer views
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature8" fontWeight="bold">
        International currency support
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature9" fontWeight="bold">
        Customer support
      </Text>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <Text key="feature10" fontWeight="bold">
        Monthly upsell revenue limit
      </Text>,
      <span key="1">Up to $500 USD</span>,
      <span key="2">Up to $1,500 USD</span>,
      <span key="3">UNLIMITED</span>
    ],
    [
      null,
      <Button
        key="action1"
        primary
        fullWidth
        disabled={
          (shop?.plan.level === 'BASIC' && shop?.plan.active) || changingPlan
        }
        onClick={() => initiatePlanChange('BASIC')}
      >
        {shop?.plan.level === 'BASIC' && shop?.plan.active
          ? 'Current plan'
          : 'Select'}
      </Button>,
      <Button
        key="action2"
        primary
        fullWidth
        disabled={
          (shop?.plan.level === 'PLUS' && shop?.plan.active) || changingPlan
        }
        onClick={() => initiatePlanChange('PLUS')}
      >
        {shop?.plan.level === 'PLUS' && shop?.plan.active
          ? 'Current plan'
          : 'Select'}
      </Button>,
      <Button
        key="action3"
        primary
        fullWidth
        disabled={
          (shop?.plan.level === 'PRO' && shop?.plan.active) || changingPlan
        }
        onClick={() => initiatePlanChange('PRO')}
      >
        {shop?.plan.level === 'PRO' && shop?.plan.active
          ? 'Current plan'
          : 'Select'}
      </Button>
    ]
  ];

  useEffect(() => {
    setActivatingPlan(true);

    if (chargeId && !activatingPlan) {
      (async () => {
        await activatePlan();
        router.push('/');
      })();
    }
  }, [chargeId, activatingPlan, activatePlan]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page
      title={
        shop?.plan.active ? (
          <>
            <Stack alignment="center">
              <Breadcrumbs breadcrumbs={[{ url: '/' }]} />
              <span>Plan</span>
            </Stack>
          </>
        ) : undefined
      }
    >
      {shop?.plan.active && <PageTitleBar />}
      <Layout>
        {!shop?.plan.active && (
          <Layout.Section>
            <TextContainer>
              <Stack alignment="center" vertical>
                <Text variant="heading4xl">Select your plan</Text>
                <Text color="subdued" variant="headingLg">
                  All plans include a 7-day free trial.
                </Text>
              </Stack>
            </TextContainer>
          </Layout.Section>
        )}
        <Layout.Section>
          <Card sectioned>
            <PlanTableContainer>
              <DataTable
                columnContentTypes={['text', 'text', 'text', 'text']}
                headings={[
                  null,
                  <Text fontWeight="bold" key="basic" as="div">
                    <Stack vertical spacing="tight">
                      <Text variant="headingMd" as="h2">
                        Basic
                      </Text>
                      <Text variant="heading2xl">$24/month</Text>
                    </Stack>
                  </Text>,
                  <Text fontWeight="bold" key="plus" as="div">
                    <Stack vertical spacing="tight">
                      <Text variant="headingMd" as="h2">
                        Plus
                      </Text>
                      <Text variant="heading2xl">$49/month</Text>
                    </Stack>
                  </Text>,
                  <Text fontWeight="bold" key="pro" as="div">
                    <Stack vertical spacing="tight">
                      <Text variant="headingMd" as="h2">
                        Pro
                      </Text>
                      <Text variant="heading2xl">$99/month</Text>
                    </Stack>
                  </Text>
                ]}
                rows={planData}
                truncate={false}
                hoverable={false}
                verticalAlign="bottom"
              />
            </PlanTableContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default PlanPage;
