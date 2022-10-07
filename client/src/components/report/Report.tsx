import React, { useContext, useState, useRef } from 'react';
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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      // text: 'Net Assets',
    },
  },
};

const quartels = ['Jan', 'Apr', 'Jul', 'Oct'];

const Report: React.FC = () => {
  const [years, setYears] = useState<string[]>([]);
  const {items, params} = useContext(Context);
  const quarterlyModifier = (1 + (params.roi - params.inflation) / 100) ** (1/4);
  const yearInput = useRef<HTMLInputElement>(null);
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  // O(n)
  for (let item of items) {
    switch (item.category) {
      case Category.Income:
        monthlyIncome += item.amount;
        break;
      case Category.Expense:
        monthlyExpense += item.amount;
        break;
      default:
        console.log("Unknown Category");
    }
  }

  const quarterlyNet = 3 * (monthlyIncome - monthlyExpense)
  const totalNet = [];
  let net = 0;

  // O(n)
  for (let year of years) {
    for (let quartel of quartels) {
      net = Math.floor(quarterlyModifier * (net + quarterlyNet));

      totalNet.push([`${quartel} ${year}`, net]);
    }
  }

  const data = {
    totalNet,
    datasets: [
      {
        fill: true,
        label: 'Net Assets',
        data: totalNet,
        borderColor: 'rgb(53, 235, 162)',
        backgroundColor: 'rgba(53, 235, 162, 0.5)',
      },
    ],
  };

  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
  }

  return (
    <div className={`${styles.report} card`}>
      <h2>Report</h2>
      <form onSubmit={(ev) => handleFormSubmit(ev)}>
        <div>
          <span>
            <input ref={yearInput} type="date"></input>
          </span>
        </div>
        <hr></hr>
        <button>Update</button>
      </form>
      {items.length && <table>
        <tbody>
          <tr>
            <td>Income</td>
            <td align="right">{monthlyIncome}</td>
          </tr>
          <tr>
            <td>Expenses</td>
            <td align="right">-{monthlyExpense}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td align="right">{monthlyIncome - monthlyExpense}</td>
          </tr>
        </tfoot>
      </table> || ""}
      <Line options={options} data={data} />
    </div>
  );
}

export default Report;
