import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = {
  title: {
    text: ''
  },
  yAxis: {
    title: {
      text: ''
    }
  },
  xAxis: {
    type: 'datetime',
    accessibility: {
      rangeDescription: 'Range: January to December'
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
      data: [
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
    }
  ],
  chart: {
    style: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif'
    }
  },
  exporting: {
    enabled: false
  },
  credits: {
    enabled: false
  }
};

const ConversionsChart = (props) => (
  <HighchartsReact highcharts={Highcharts} options={options} {...props} />
);

export default ConversionsChart;
