import React from 'react';
import { ITimeSeries } from '../interfaces';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import './timeSeries.css';

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
          callback(val: string | number, index: number): string {
            const label = this.getLabelForValue(Number(val));
            return label.includes("Jan") ? label : '';
          },
        }
      }
    }
  };

  const data = {
    series,
    datasets: [
      {
        fill: true,
        label: 'Net Assets',
        data: series,
        borderColor: 'rgb(53, 235, 162)',
        backgroundColor: 'rgba(53, 235, 162, 0.5)',
      },
    ],
  };

  return <Line options={options as any} data={data} />;
}

export default TimeSeriesChart;
