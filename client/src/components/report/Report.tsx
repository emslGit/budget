import React, { useContext, useState, useRef, useEffect } from 'react';
import {Context} from "../baseLayout/BaseLayout"
import { Category } from '../interfaces';
import styles from './report.module.css';
import { Line } from 'react-chartjs-2';

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

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Report: React.FC = () => {
  const {items, params} = useContext(Context);
  const modifier = (1 + (params.roi - params.inflation) / 100);
  const today = new Date();
  const startYear = today.getFullYear();
  const startMonth = today.getMonth();
  const [years, setYears] = useState<number[]>([startYear, startYear + 1]);

  const options = {
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
    ticks: {
      autoSkip: true,
      maxTicksLimit: years.length,
    }
  };

  let totalNet = 0;
  const totalNetArr: {[key: string]: number} = {};
  
  // O(n)
  for (let year of years) {
    for (let i = 0; i <= 11; i++) { 
      if (year == startYear && i < startMonth) {
        continue;
      }
      
      for (let item of items) {
        const yearFrom = item.yearFrom || startYear;
        const yearTo = item.yearTo || years[years.length - 1];
        const monthFrom = (item.monthFrom || 1) - 1;
        const monthTo = (item.monthTo || 12) - 1;

        if (
          yearFrom <= year &&
          monthFrom <= i &&
          yearTo >= year &&
          monthTo >= i
        ) {
          totalNet += ((item.category === Category.Expense) ? -1 : 1) * item.amount;
          totalNetArr[`${year}-${i}`] = totalNet;          
        }
      }
    }
    totalNet = Math.floor(modifier * totalNet);
  }

  const data = {
    totalNetArr,
    datasets: [
      {
        fill: true,
        label: 'Net Assets',
        data: totalNetArr,
        borderColor: 'rgb(53, 235, 162)',
        backgroundColor: 'rgba(53, 235, 162, 0.5)',
      },
    ],
  };

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const endYear = Number((ev.target as HTMLInputElement).value);
    setYears(Array.from({length: endYear - startYear + 1}, (v, k) => startYear + k));
  }

  return (
    <div className={`${styles.report} card`}>
      <h2>Report</h2>
      <form>
        <div>
          <label>Range</label>
          <span>
            {`${startYear} - `}
            <input
              className='yearInput'
              type="number"
              min={startYear + 1}
              max={startYear + 30}
              defaultValue={startYear + 1}
              onChange={(ev) => handleInputChange(ev)}
            />
          </span>
        </div>
      </form>
      <Line options={options} data={data} />
    </div>
  );
}

export default Report;
