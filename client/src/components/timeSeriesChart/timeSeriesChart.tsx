import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { ITimeSeries } from '../../utils/interfaces';
import { primaryColor, primaryColor50 } from '../../utils/colors';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface IProps {
  series: ITimeSeries;
  startYear: number;
  endYear: number;
}

const TimeSeriesChart: React.FC<IProps> = ({series, startYear, endYear}: IProps) => {

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
    },
    animation: {
      duration: 0
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          // TODO: decide if we should go with years only
          // callback(val: string | number, index: number): string {
          //   const label = this.getLabelForValue(Number(val));
          //   return label.includes("Jan") ? label : '';
          // },
        }
      }
    }
  };

  // TODO: variables for the colors
  const data = {
    series,
    datasets: [
      {
        fill: true,
        label: 'Net Assets',
        data: series,
        borderColor: primaryColor,
        backgroundColor: primaryColor50,
      },
    ],
  };

  return <Line options={options as any} data={data} />;
}

export default TimeSeriesChart;
