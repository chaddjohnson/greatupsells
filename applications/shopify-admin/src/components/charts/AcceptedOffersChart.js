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

const AcceptedOffersChart = (props) => (
  <HighchartsReact highcharts={Highcharts} options={options} {...props} />
);

export default AcceptedOffersChart;
