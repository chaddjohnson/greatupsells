import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const options = {
  title: {
    text: 'Overall revenue increase',
    align: 'left'
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
      marker: {
        enabled: false
      }
    }
  },
  series: [
    {
      data: [
        [new Date('1/1/2019').getTime(), 25],
        [new Date('2/1/2019').getTime(), 36],
        [new Date('3/1/2019').getTime(), 50],
        [new Date('4/1/2019').getTime(), 73],
        [new Date('5/1/2019').getTime(), 115],
        [new Date('6/1/2019').getTime(), 92],
        [new Date('7/1/2019').getTime(), 146],
        [new Date('8/1/2019').getTime(), 125],
        [new Date('9/1/2019').getTime(), 170],
        [new Date('10/1/2019').getTime(), 160],
        [new Date('11/1/2019').getTime(), 180],
        [new Date('12/1/2019').getTime(), 201]
      ]
    }
  ],
  exporting: {
    enabled: false
  },
  credits: {
    enabled: false
  }
};

const RevenueIncreaseChart = (props) => (
  <HighchartsReact highcharts={Highcharts} options={options} {...props} />
);

export default RevenueIncreaseChart;
