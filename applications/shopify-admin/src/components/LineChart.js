import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import noData from 'highcharts/modules/no-data-to-display';
import {
  Stack,
  Heading,
  Subheading,
  DisplayText,
  TextStyle,
  Icon
} from '@shopify/polaris';
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
        accessibility: {
          rangeDescription: rangeDescription && `Range: ${rangeDescription}`
        }
      },
      yAxis: {
        title: {
          text: ''
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
        padding: 16,
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

          return `<div style="font-weight: 500">${month} ${date.getDate()}</div><div style="margin-top: 5px">${
            this.y
          } ${(
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
    [title, rangeDescription, tooltipText, data, emptyMessage]
  );

  const changeValue = useMemo(() => {
    if (!data?.length) {
      return 0;
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

    return latest / earliest - 1;
  }, [data]);

  return (
    <>
      <Stack vertical>
        <Stack vertical spacing="tight">
          {typeof title === 'string' ? <Heading>{title}</Heading> : title}
          {(typeof changeValue !== 'undefined' ||
            typeof changePercentage !== 'undefined') && (
            <Stack alignment="center" spacing="tight">
              {changeValue && (
                <DisplayText size="medium" element="div">
                  {formatNumber(changeValue)}
                </DisplayText>
              )}
              {typeof changePercentage !== 'undefined' && changePercentage > 0 && (
                <DisplayText size="small" element="div">
                  <Stack spacing="none" alignment="center">
                    <Icon source={ArrowUpMinor} color="success" />
                    <TextStyle variation="positive">
                      {formatPercentage(changePercentage, 0)}
                    </TextStyle>
                  </Stack>
                </DisplayText>
              )}
              {typeof changePercentage !== 'undefined' && changePercentage < 0 && (
                <DisplayText size="small" element="div">
                  <Stack spacing="none" alignment="center">
                    <Icon source={ArrowDownMinor} color="critical" />
                    <TextStyle variation="negative">
                      {formatPercentage(changePercentage, 0)}
                    </TextStyle>
                  </Stack>
                </DisplayText>
              )}
            </Stack>
          )}
        </Stack>
        {subtitle && (
          <Subheading>
            <TextStyle variation="subdued">{subtitle}</TextStyle>
          </Subheading>
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
