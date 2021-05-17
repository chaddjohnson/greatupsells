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
import moment from 'moment-timezone';
import { useNumberFormatter } from '@neatowebsolutions/upselling-react-hooks';
import { useShop } from '../hooks';
import { TitleBar, LineChart } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Analytics" />);

const data = {
  acceptedOffers: [
    [moment('2020-06-01').startOf('day').valueOf(), 91],
    [moment('2020-06-02').startOf('day').valueOf(), 33],
    [moment('2020-06-03').startOf('day').valueOf(), 72],
    [moment('2020-06-04').startOf('day').valueOf(), 35],
    [moment('2020-06-05').startOf('day').valueOf(), 187],
    [moment('2020-06-06').startOf('day').valueOf(), 180],
    [moment('2020-06-07').startOf('day').valueOf(), 160],
    [moment('2020-06-08').startOf('day').valueOf(), 21],
    [moment('2020-06-09').startOf('day').valueOf(), 101],
    [moment('2020-06-10').startOf('day').valueOf(), 113],
    [moment('2020-06-11').startOf('day').valueOf(), 97],
    [moment('2020-06-12').startOf('day').valueOf(), 43],
    [moment('2020-06-13').startOf('day').valueOf(), 30],
    [moment('2020-06-14').startOf('day').valueOf(), 75],
    [moment('2020-06-15').startOf('day').valueOf(), 87],
    [moment('2020-06-16').startOf('day').valueOf(), 118],
    [moment('2020-06-17').startOf('day').valueOf(), 159],
    [moment('2020-06-18').startOf('day').valueOf(), 180],
    [moment('2020-06-19').startOf('day').valueOf(), 146],
    [moment('2020-06-20').startOf('day').valueOf(), 166],
    [moment('2020-06-21').startOf('day').valueOf(), 192],
    [moment('2020-06-22').startOf('day').valueOf(), 116],
    [moment('2020-06-23').startOf('day').valueOf(), 193],
    [moment('2020-06-24').startOf('day').valueOf(), 121],
    [moment('2020-06-25').startOf('day').valueOf(), 28],
    [moment('2020-06-26').startOf('day').valueOf(), 83],
    [moment('2020-06-27').startOf('day').valueOf(), 66],
    [moment('2020-06-28').startOf('day').valueOf(), 66],
    [moment('2020-06-29').startOf('day').valueOf(), 7],
    [moment('2020-06-30').startOf('day').valueOf(), 171]
  ],
  revenueIncrease: [
    [moment('2020-06-01').startOf('day').valueOf(), 90],
    [moment('2020-06-02').startOf('day').valueOf(), 162],
    [moment('2020-06-03').startOf('day').valueOf(), 153],
    [moment('2020-06-04').startOf('day').valueOf(), 82],
    [moment('2020-06-05').startOf('day').valueOf(), 166],
    [moment('2020-06-06').startOf('day').valueOf(), 100],
    [moment('2020-06-07').startOf('day').valueOf(), 146],
    [moment('2020-06-08').startOf('day').valueOf(), 61],
    [moment('2020-06-09').startOf('day').valueOf(), 163],
    [moment('2020-06-10').startOf('day').valueOf(), 168],
    [moment('2020-06-11').startOf('day').valueOf(), 127],
    [moment('2020-06-12').startOf('day').valueOf(), 1],
    [moment('2020-06-13').startOf('day').valueOf(), 191],
    [moment('2020-06-14').startOf('day').valueOf(), 96],
    [moment('2020-06-15').startOf('day').valueOf(), 1],
    [moment('2020-06-16').startOf('day').valueOf(), 141],
    [moment('2020-06-17').startOf('day').valueOf(), 151],
    [moment('2020-06-18').startOf('day').valueOf(), 167],
    [moment('2020-06-19').startOf('day').valueOf(), 73],
    [moment('2020-06-20').startOf('day').valueOf(), 116],
    [moment('2020-06-21').startOf('day').valueOf(), 193],
    [moment('2020-06-22').startOf('day').valueOf(), 107],
    [moment('2020-06-23').startOf('day').valueOf(), 59],
    [moment('2020-06-24').startOf('day').valueOf(), 21],
    [moment('2020-06-25').startOf('day').valueOf(), 124],
    [moment('2020-06-26').startOf('day').valueOf(), 171],
    [moment('2020-06-27').startOf('day').valueOf(), 11],
    [moment('2020-06-28').startOf('day').valueOf(), 37],
    [moment('2020-06-29').startOf('day').valueOf(), 46],
    [moment('2020-06-30').startOf('day').valueOf(), 82]
  ],
  impressions: [
    [moment('2020-06-01').startOf('day').valueOf(), 17],
    [moment('2020-06-02').startOf('day').valueOf(), 81],
    [moment('2020-06-03').startOf('day').valueOf(), 188],
    [moment('2020-06-04').startOf('day').valueOf(), 192],
    [moment('2020-06-05').startOf('day').valueOf(), 5],
    [moment('2020-06-06').startOf('day').valueOf(), 193],
    [moment('2020-06-07').startOf('day').valueOf(), 42],
    [moment('2020-06-08').startOf('day').valueOf(), 55],
    [moment('2020-06-09').startOf('day').valueOf(), 112],
    [moment('2020-06-10').startOf('day').valueOf(), 104],
    [moment('2020-06-11').startOf('day').valueOf(), 174],
    [moment('2020-06-12').startOf('day').valueOf(), 175],
    [moment('2020-06-13').startOf('day').valueOf(), 76],
    [moment('2020-06-14').startOf('day').valueOf(), 131],
    [moment('2020-06-15').startOf('day').valueOf(), 30],
    [moment('2020-06-16').startOf('day').valueOf(), 158],
    [moment('2020-06-17').startOf('day').valueOf(), 72],
    [moment('2020-06-18').startOf('day').valueOf(), 147],
    [moment('2020-06-19').startOf('day').valueOf(), 165],
    [moment('2020-06-20').startOf('day').valueOf(), 109],
    [moment('2020-06-21').startOf('day').valueOf(), 100],
    [moment('2020-06-22').startOf('day').valueOf(), 72],
    [moment('2020-06-23').startOf('day').valueOf(), 163],
    [moment('2020-06-24').startOf('day').valueOf(), 137],
    [moment('2020-06-25').startOf('day').valueOf(), 99],
    [moment('2020-06-26').startOf('day').valueOf(), 165],
    [moment('2020-06-27').startOf('day').valueOf(), 126],
    [moment('2020-06-28').startOf('day').valueOf(), 173],
    [moment('2020-06-29').startOf('day').valueOf(), 172],
    [moment('2020-06-30').startOf('day').valueOf(), 93]
  ],
  conversions: [
    [moment('2020-06-01').startOf('day').valueOf(), 171],
    [moment('2020-06-02').startOf('day').valueOf(), 195],
    [moment('2020-06-03').startOf('day').valueOf(), 124],
    [moment('2020-06-04').startOf('day').valueOf(), 27],
    [moment('2020-06-05').startOf('day').valueOf(), 107],
    [moment('2020-06-06').startOf('day').valueOf(), 124],
    [moment('2020-06-07').startOf('day').valueOf(), 104],
    [moment('2020-06-08').startOf('day').valueOf(), 53],
    [moment('2020-06-09').startOf('day').valueOf(), 92],
    [moment('2020-06-10').startOf('day').valueOf(), 185],
    [moment('2020-06-11').startOf('day').valueOf(), 168],
    [moment('2020-06-12').startOf('day').valueOf(), 146],
    [moment('2020-06-13').startOf('day').valueOf(), 59],
    [moment('2020-06-14').startOf('day').valueOf(), 25],
    [moment('2020-06-15').startOf('day').valueOf(), 117],
    [moment('2020-06-16').startOf('day').valueOf(), 144],
    [moment('2020-06-17').startOf('day').valueOf(), 180],
    [moment('2020-06-18').startOf('day').valueOf(), 41],
    [moment('2020-06-19').startOf('day').valueOf(), 96],
    [moment('2020-06-20').startOf('day').valueOf(), 59],
    [moment('2020-06-21').startOf('day').valueOf(), 117],
    [moment('2020-06-22').startOf('day').valueOf(), 69],
    [moment('2020-06-23').startOf('day').valueOf(), 10],
    [moment('2020-06-24').startOf('day').valueOf(), 95],
    [moment('2020-06-25').startOf('day').valueOf(), 68],
    [moment('2020-06-26').startOf('day').valueOf(), 99],
    [moment('2020-06-27').startOf('day').valueOf(), 71],
    [moment('2020-06-28').startOf('day').valueOf(), 74],
    [moment('2020-06-29').startOf('day').valueOf(), 92],
    [moment('2020-06-30').startOf('day').valueOf(), 16]
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
                data={data.acceptedOffers}
                formatters={{
                  number: formatNumber,
                  percentage: formatPercentage
                }}
              />
            </Card>
            <Card sectioned>
              <LineChart
                title="Offer impressions"
                subtitle="Offer impressions over last 90 days"
                rangeDescription="January to December"
                data={data.impressions}
                formatters={{
                  number: formatNumber,
                  percentage: formatPercentage
                }}
              />
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card sectioned>
              <LineChart
                title="Revenue increase"
                subtitle="Revenue increase over last 90 days"
                rangeDescription="January to December"
                data={data.revenueIncrease}
                formatters={{
                  number: formatCurrency,
                  percentage: formatPercentage
                }}
              />
            </Card>
            <Card sectioned>
              <LineChart
                title="Conversion rate"
                subtitle="Conversion rate over last 90 days"
                rangeDescription="January to December"
                data={data.conversions}
                formatters={{
                  number: formatNumber,
                  percentage: formatPercentage
                }}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Stack>
    </Page>
  );
};

export default AnalyticsPage;
