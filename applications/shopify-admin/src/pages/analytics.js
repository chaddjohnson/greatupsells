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
} from '../components';

const PageTitleBar = memo(() => <TitleBar title="Dashboard" />);

const AnalyticsPage = () => {
  const [datePickerActive, setDatePickerActive] = useState(false);

  return (
    <Page title="Analytics for all offers" fullWidth>
      <PageTitleBar />
      <Stack vertical>
        <Stack distribution="equalSpacing">
          <DisplayText size="medium">
            <TextStyle variation="subdued">
              Here&rsquo;s a summary of how your offers are performing
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

export async function getServerSideProps() {
  return {
    props: {}
  };
}

export default AnalyticsPage;
