import { memo, useState } from 'react';
import {
  Page,
  Layout,
  Card,
  Stack,
  Popover,
  Button,
  DisplayText,
  TextStyle
} from '@shopify/polaris';
import { CalendarMajorMonotone } from '@shopify/polaris-icons';
import {
  TitleBar,
  AcceptedOffersChart,
  RevenueIncreaseChart,
  OfferViewsChart,
  ConversionsChart
} from '../../../components';

const OfferAnalyticsPage = () => {
  const [datePickerActive, setDatePickerActive] = useState(false);

  const offer = {
    _id: 'a702955babd0e0c9bdcf176c13b60a1f',
    name: 'Buy one get 10% off'
  };

  const PageTitleBar = memo(() => (
    <TitleBar
      title="Analytics"
      breadcrumbs={[
        { content: 'Offers', url: '/offers' },
        {
          content: offer.name,
          url: `/offers/${offer._id}`
        }
      ]}
    />
  ));

  return (
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
              <AcceptedOffersChart />
            </Card>
            <Card sectioned>
              <OfferViewsChart />
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card sectioned>
              <RevenueIncreaseChart />
            </Card>
            <Card sectioned>
              <ConversionsChart />
            </Card>
          </Layout.Section>
        </Layout>
      </Stack>
    </Page>
  );
};

export default OfferAnalyticsPage;
