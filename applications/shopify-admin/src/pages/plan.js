import { memo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  Page,
  Breadcrumbs,
  Layout,
  Card,
  DataTable,
  TextStyle,
  DisplayText,
  Button,
  Heading,
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
      <TextStyle key="feature1" variation="strong">
        One-click upsells and cross-sells
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature2" variation="strong">
        Post-purchase offers
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature3" variation="strong">
        Thank You page offers
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature3" variation="strong">
        Order Status page offers
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature4" variation="strong">
        Themes
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature5" variation="strong">
        Analytics
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature6" variation="strong">
        Unlimited offers
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature7" variation="strong">
        Unlimited offer views
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature8" variation="strong">
        International currency support
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature9" variation="strong">
        Customer support
      </TextStyle>,
      <Icon key="1" source={TickMinor} color="success" />,
      <Icon key="2" source={TickMinor} color="success" />,
      <Icon key="3" source={TickMinor} color="success" />
    ],
    [
      <TextStyle key="feature10" variation="strong">
        Monthly upsell revenue limit
      </TextStyle>,
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
                <DisplayText size="extraLarge">Select your plan</DisplayText>
                <DisplayText size="small">
                  <TextStyle variation="subdued">
                    All plans include a 7-day free trial.
                  </TextStyle>
                </DisplayText>
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
                  <TextStyle key="basic" variation="strong">
                    <Stack vertical spacing="tight">
                      <Heading>Basic</Heading>
                      <DisplayText size="large">$24/month</DisplayText>
                    </Stack>
                  </TextStyle>,
                  <TextStyle key="plus" variation="strong">
                    <Stack vertical spacing="tight">
                      <Heading>Plus</Heading>
                      <DisplayText size="large">$49/month</DisplayText>
                    </Stack>
                  </TextStyle>,
                  <TextStyle key="pro" variation="strong">
                    <Stack vertical spacing="tight">
                      <Heading>Pro</Heading>
                      <DisplayText size="large">$99/month</DisplayText>
                    </Stack>
                  </TextStyle>
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
