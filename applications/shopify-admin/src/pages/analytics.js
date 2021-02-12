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
import { CalendarMajor } from '@shopify/polaris-icons';
import { useNumberFormatter } from '@neatowebsolutions/upselling-react-hooks';
import { useShop } from '../hooks';
import { TitleBar, LineChart } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Analytics" />);

const data = {
  acceptedOffers: [
    [new Date('6/1/2020').getTime(), 91],
    [new Date('6/2/2020').getTime(), 33],
    [new Date('6/3/2020').getTime(), 72],
    [new Date('6/4/2020').getTime(), 35],
    [new Date('6/5/2020').getTime(), 187],
    [new Date('6/6/2020').getTime(), 180],
    [new Date('6/7/2020').getTime(), 160],
    [new Date('6/8/2020').getTime(), 21],
    [new Date('6/9/2020').getTime(), 101],
    [new Date('6/10/2020').getTime(), 113],
    [new Date('6/11/2020').getTime(), 97],
    [new Date('6/12/2020').getTime(), 43],
    [new Date('6/13/2020').getTime(), 30],
    [new Date('6/14/2020').getTime(), 75],
    [new Date('6/15/2020').getTime(), 87],
    [new Date('6/16/2020').getTime(), 118],
    [new Date('6/17/2020').getTime(), 159],
    [new Date('6/18/2020').getTime(), 180],
    [new Date('6/19/2020').getTime(), 146],
    [new Date('6/20/2020').getTime(), 166],
    [new Date('6/21/2020').getTime(), 192],
    [new Date('6/22/2020').getTime(), 116],
    [new Date('6/23/2020').getTime(), 193],
    [new Date('6/24/2020').getTime(), 121],
    [new Date('6/25/2020').getTime(), 28],
    [new Date('6/26/2020').getTime(), 83],
    [new Date('6/27/2020').getTime(), 66],
    [new Date('6/28/2020').getTime(), 66],
    [new Date('6/29/2020').getTime(), 7],
    [new Date('6/30/2020').getTime(), 171]
  ],
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

const AnalyticsPage = () => {
  const [datePickerActive, setDatePickerActive] = useState(false);

  const { shop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const {
    formatNumber,
    formatCurrency,
    formatPercentage
  } = useNumberFormatter({ locale, countryCode, currency });

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
                icon={CalendarMajor}
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
              <LineChart
                title="Accepted offers"
                subtitle="Accepted offers over last 90 days"
                rangeDescription="January to December"
                changeValue={formatNumber(85)}
                changePercentage={formatPercentage(0.01, 1)}
                data={data.acceptedOffers}
              />
            </Card>
            <Card sectioned>
              <LineChart
                title="Offer views"
                subtitle="Offer views over last 90 days"
                rangeDescription="January to December"
                changeValue={formatNumber(214)}
                changePercentage={formatPercentage(0.116, 1)}
                data={data.acceptedOffers}
              />
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card sectioned>
              <LineChart
                title="Revenue increase"
                subtitle="Revenue increase over last 90 days"
                rangeDescription="January to December"
                changeValue={formatCurrency(364)}
                changePercentage={formatPercentage(0.06, 1)}
                data={data.revenueIncrease}
              />
            </Card>
            <Card sectioned>
              <LineChart
                title="Conversion rate"
                subtitle="Conversion rate over last 90 days"
                rangeDescription="January to December"
                changeValue={formatNumber(14)}
                changePercentage={formatPercentage(0.04, 1)}
                data={data.acceptedOffers}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Stack>
    </Page>
  );
};

export default AnalyticsPage;
