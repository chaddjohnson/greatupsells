import React from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const options = {
  title: {
    text: 'Accepted offers'
  },
  yAxis: {
    title: {
      text: ''
    }
  },
  xAxis: {
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
      pointStart: 2010
    }
  },
  series: [
    {
      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133]
    }
  ]
  // responsive: {
  //   rules: [
  //     {
  //       condition: {
  //         maxWidth: 500
  //       },
  //       chartOptions: {
  //         legend: {
  //           layout: 'horizontal',
  //           align: 'center',
  //           verticalAlign: 'bottom'
  //         }
  //       }
  //     }
  //   ]
  // }
};

const AcceptedOffersChart = (props) => (
  <HighchartsReact highcharts={Highcharts} options={options} {...props} />
);

export default AcceptedOffersChart;
