import React, { useState } from "react";
import dayjs, {Dayjs} from 'dayjs';
import { Category, Frequency, MONTHS } from "../../utils/constants";
import { IFinanceItem, IFinanceParams, ITimeSeries } from "../../utils/interfaces";
import TimeSeriesChart from "../timeSeriesChart/timeSeriesChart";
import "./report.css";

interface IProps {
  items: IFinanceItem[];
  params: IFinanceParams;
}

export const dataAsTimeSeries = (
  items: IFinanceItem[],
  annualModifier: number,
  today: Dayjs,
  endYear: number
): ITimeSeries => {
  const totalNetArr: ITimeSeries = {};
  let totalNet = 0;

  for (let i = today.year(); i <= endYear; i++) {
    for (let j = 0; j <= 11; j++) {
      if (i == today.year() && j < today.month()) {
        continue;
      }

      for (let item of items) {
        // TODO: assign these at add time
        const frequency = item.frequency;
        const yearFrom = item.dateFrom?.year() || today.year();
        const yearTo = item.dateTo?.year() || endYear;
        const monthFrom = item.dateFrom ? item.dateFrom.month() : today.month();
        const monthTo = item.dateTo ? item.dateTo.month() : 11;
        const current = i * 100 + j;

        if (item.category === Category.Expense) {
          console.log("e")
        }

        // only if item within time range, and only run annual once a year
        if (
          current >= (yearFrom * 100 + monthFrom) &&
          current <= (yearTo * 100 + monthTo) &&
          (frequency == Frequency.Annually ? j == monthFrom : true)
        ) {
          totalNet += item.category * item.amount * (frequency === Frequency.Weekly ? 4 : 1);
        }
      }

      totalNetArr[`${MONTHS[j + 1]} ${i}`] = Math.round(totalNet);
    }

    totalNet *= annualModifier;
  }

  return totalNetArr;
};

const Report: React.FC<IProps> = ({ items, params }: IProps) => {
  const annualModifier = 1 + (params.roi - params.inflation) / 100;
  const today = dayjs();
  const todayYear = today.year();
  const [endYear, setEndYear] = useState<number>(todayYear + 2);

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const _endYear = Number((ev.target as HTMLInputElement).value);
    setEndYear(_endYear);
  };

  return (
    <div className={`report card`}>
      <h4>Report</h4>
      <form>
        <div>
          <label>Range</label>
          <span>
            {`${today.year()} - `}
            <input
              className="yearInput"
              type="number"
              min={todayYear + 1}
              max={todayYear + 30}
              defaultValue={endYear}
              onChange={(ev) => handleInputChange(ev)}
            />
          </span>
        </div>
      </form>
      <TimeSeriesChart
        series={dataAsTimeSeries(items, annualModifier, today, endYear)}
        startYear={todayYear}
        endYear={endYear}
      />
    </div>
  );
};

export default Report;
