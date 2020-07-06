import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  Stack,
  Heading,
  Subheading,
  DisplayText,
  TextStyle,
  Icon
} from '@shopify/polaris';
import { ArrowUpMinor } from '@shopify/polaris-icons';

const LineChart = ({
  title,
  subtitle,
  rangeDescription,
  changeValue,
  changePercentage,
  tooltipText,
  data
}) => {
  const options = useMemo(
    () => ({
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        crosshair: {
          color: 'rgba(155, 110, 219, 0.5)',
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
          color: '#9C6ADE',
          lineWidth: 3,
          marker: {
            enabled: false
          }
        }
      },
      series: [
        {
          name: title,
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
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      }
    }),
    [title, rangeDescription, tooltipText, data]
  );

  return (
    <>
      <Stack vertical>
        <Stack vertical spacing="tight">
          {typeof title === 'string' ? <Heading>{title}</Heading> : title}
          {(changeValue || changePercentage) && (
            <Stack alignment="center" spacing="tight">
              {changeValue && (
                <DisplayText size="medium" element="div">
                  {changeValue}
                </DisplayText>
              )}
              {changePercentage && (
                <DisplayText size="small" element="div">
                  <Stack spacing="none" alignment="center">
                    <Icon source={ArrowUpMinor} color="green" />
                    <span style={{ color: '#50b83c' }}>
                      {Math.round(changePercentage * 100 * 10) / 10}%
                    </span>
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
  changeValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePercentage: PropTypes.number,
  tooltipText: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default LineChart;
