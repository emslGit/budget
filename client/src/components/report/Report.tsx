import React, { useContext } from 'react';
import {Context} from "../baseLayout/BaseLayout"
import { Category } from '../Category';
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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];



const Report: React.FC = () => {
  const items = useContext(Context);
  const totalIncome = items.reduce((sum, item) => (item.category == Category.Income) ? sum + item.amount : sum, 0);
  const totalExpenses = items.reduce((sum, item) => (item.category == Category.Expense) ? sum + item.amount : sum, 0);
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Net Assets',
        data: labels.map((label, i) => i * (totalExpenses + totalIncome)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className={`${styles.report} card`}>
      <h2>Report</h2>
      {items.length && <table>
        <tbody>
          <tr>
            <td>Income</td>
            <td align="right">{totalIncome}</td>
          </tr>
          <tr>
            <td>Expenses</td>
            <td align="right">-{totalExpenses}</td>
          </tr>
        </tbody>
        <hr></hr>
        <tfoot>
          <tr>
            <td>Total</td>
            <td align="right">{totalIncome - totalExpenses}</td>
          </tr>
        </tfoot>
      </table> || ""}
      <Line options={options} data={data} />;
    </div>
  );
}

export default Report;
