import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import noData from 'highcharts/modules/no-data-to-display';
import { BlockStack, InlineStack, Text, Icon } from '@shopify/polaris';
import { ArrowUpIcon, ArrowDownIcon } from '@shopify/polaris-icons';

if (typeof window !== 'undefined') {
  noData(Highcharts);
}

const LineChart = ({
  title,
  subtitle,
  rangeDescription,
  tooltipText,
  data = [],
  emptyMessage = 'No data available.',
  formatters: { number: formatNumber = (value) => value, percentage: formatPercentage = (value) => `${value}%` }
}) => {
  const options = useMemo(
    () => ({
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        crosshair: {
          color: 'rgba(0, 128, 96, 0.5)',
          width: 3
        },
        dateTimeLabelFormats: {
          millisecond: '%b %e', // Necessary for when chart only has one day of data.
          day: '%b %e'
        },
        accessibility: {
          rangeDescription: rangeDescription && `Range: ${rangeDescription}`
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          formatter(item) {
            return formatNumber(item.value);
          }
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          color: '#008060',
          lineWidth: 3,
          marker: {
            enabled: false
          }
        }
      },
      series: [
        {
          name: typeof title === 'string' && title,
          data
        }
      ],
      chart: {
        style: {
          fontFamily: '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif'
        }
      },
      tooltip: {
        xDateFormat: '%b %e',
        crosshairs: true,
        backgroundColor: 'rgba(33, 43, 54, 0.9)',
        borderRadius: 5,
        borderWidth: 0,
        shadow: false,
        padding: 12,
        style: {
          color: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif',
          fontSize: '13px',
          textAlign: 'center'
        },
        useHTML: true,
        formatter() {
          const date = new Date(this.x);
          const month = date.toLocaleString('default', { month: 'long' });

          return `<div style="font-weight: 500">${month} ${date.getDate()}</div><div style="margin-top: 5px">${formatNumber(
            this.y
          )} ${(tooltipText || (typeof title === 'string' && title) || '').toLowerCase()}</div>`;
        }
      },
      lang: {
        noData: emptyMessage
      },
      noData: {
        style: {
          fontWeight: '400',
          fontSize: '15px',
          color: '#6D7175'
        }
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    }),
    [title, rangeDescription, tooltipText, data, emptyMessage, formatNumber]
  );

  const changeValue = useMemo(() => {
    if (!data?.length) {
      return 0;
    }

    if (data?.length === 1) {
      return data[0][1];
    }

    const latest = data[data.length - 1][1];
    const earliest = data[0][1];

    return latest - earliest;
  }, [data]);

  const changePercentage = useMemo(() => {
    if (!data?.length) {
      return 0;
    }

    const latest = data[data.length - 1][1];
    const earliest = data[0][1];

    if (earliest === 0) {
      return latest;
    }

    return latest / earliest - 1;
  }, [data]);

  return (
    <>
      <BlockStack gap="200">
        <BlockStack gap="100">
          {typeof title === 'string' ? (
            <Text variant="headingMd" as="h2">
              {title}
            </Text>
          ) : (
            title
          )}
          {(typeof changeValue !== 'undefined' || typeof changePercentage !== 'undefined') && (
            <InlineStack align="start" gap="100">
              {typeof changeValue !== 'undefined' && <Text variant="headingLg">{formatNumber(changeValue)}</Text>}
              {typeof changePercentage !== 'undefined' && changePercentage > 0 && (
                <Text variant="headingLg" as="div">
                  <InlineStack gap="50" align="center">
                    <Icon source={ArrowUpIcon} tone="success" />
                    <Text tone="success">{formatPercentage(changePercentage, 0)}</Text>
                  </InlineStack>
                </Text>
              )}
              {typeof changePercentage !== 'undefined' && changePercentage < 0 && (
                <Text variant="headingLg" as="div">
                  <InlineStack gap="50" align="center">
                    <Icon source={ArrowDownIcon} tone="critical" />
                    <Text tone="critical">{formatPercentage(changePercentage, 0)}</Text>
                  </InlineStack>
                </Text>
              )}
            </InlineStack>
          )}
        </BlockStack>
        {subtitle && (
          <Text variant="headingXs" as="h3">
            <Text tone="subdued">{subtitle}</Text>
          </Text>
        )}
        <HighchartsReact highcharts={Highcharts} options={options} />
      </BlockStack>
    </>
  );
};

LineChart.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  rangeDescription: PropTypes.node,
  changeValueFormatter: PropTypes.func,
  tooltipText: PropTypes.string,
  data: PropTypes.array,
  emptyMessage: PropTypes.string,
  formatters: PropTypes.shape({
    number: PropTypes.func,
    percentage: PropTypes.func
  })
};

export default LineChart;
