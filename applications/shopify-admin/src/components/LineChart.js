import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import noData from 'highcharts/modules/no-data-to-display';
import { Stack, Text, Icon } from '@shopify/polaris';
import { ArrowUpMinor, ArrowDownMinor } from '@shopify/polaris-icons';

if (typeof window !== 'undefined') {
  noData(Highcharts);
}

const LineChart = ({
  title,
  subtitle,
  rangeDescription,
  tooltipText,
  data,
  emptyMessage,
  formatters: { number: formatNumber, percentage: formatPercentage }
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
          fontFamily:
            '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif'
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
          fontFamily:
            '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif',
          fontSize: '13px',
          textAlign: 'center'
        },
        useHTML: true,
        formatter() {
          const date = new Date(this.x);
          const month = date.toLocaleString('default', { month: 'long' });

          return `<div style="font-weight: 500">${month} ${date.getDate()}</div><div style="margin-top: 5px">${formatNumber(
            this.y
          )} ${(
            tooltipText ||
            (typeof title === 'string' && title) ||
            ''
          ).toLowerCase()}</div>`;
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
      <Stack vertical>
        <Stack vertical spacing="tight">
          {typeof title === 'string' ? (
            <Text variant="headingMd" as="h2">
              {title}
            </Text>
          ) : (
            title
          )}
          {(typeof changeValue !== 'undefined' ||
            typeof changePercentage !== 'undefined') && (
            <Stack alignment="center" spacing="tight">
              {typeof changeValue !== 'undefined' && (
                <Text variant="headingLg">{formatNumber(changeValue)}</Text>
              )}
              {typeof changePercentage !== 'undefined' &&
                changePercentage > 0 && (
                  <Text variant="headingLg" as="div">
                    <Stack spacing="none" alignment="center">
                      <Icon source={ArrowUpMinor} color="success" />
                      <Text color="success">
                        {formatPercentage(changePercentage, 0)}
                      </Text>
                    </Stack>
                  </Text>
                )}
              {typeof changePercentage !== 'undefined' &&
                changePercentage < 0 && (
                  <Text variant="headingLg" as="div">
                    <Stack spacing="none" alignment="center">
                      <Icon source={ArrowDownMinor} color="critical" />
                      <Text color="critical">
                        {formatPercentage(changePercentage, 0)}
                      </Text>
                    </Stack>
                  </Text>
                )}
            </Stack>
          )}
        </Stack>
        {subtitle && (
          <Text variant="headingXs" as="h3">
            <Text color="subdued">{subtitle}</Text>
          </Text>
        )}
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Stack>
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

LineChart.defaultProps = {
  data: [],
  emptyMessage: 'No data available.',
  formatters: {
    number: (value) => value,
    percentage: (value) => `${value}%`
  }
};

export default LineChart;
