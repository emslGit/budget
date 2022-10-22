import React, { useState } from "react";
import { Frequency, MONTHS } from "../../utils/constants";
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
  today: Date,
  endYear: number
): ITimeSeries => {
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const totalNetArr: ITimeSeries = {};
  let totalNet = 0;

  for (let i = todayYear; i <= endYear; i++) {
    for (let j = 0; j <= 11; j++) {
      if (i == todayYear && j < todayMonth) {
        continue;
      }

      for (let item of items) {
        // TODO: assign these at add time
        const frequency = item.frequency;
        const yearFrom = item.yearFrom || todayYear;
        const yearTo = item.yearTo || endYear;
        const monthFrom = (item.monthFrom || todayMonth) - 1;
        const monthTo = (item.monthTo || 12) - 1;
        const current = i * 100 + j;

        // only if item within time range, and only run annual once a year
        if (
          current >= (yearFrom * 100 + monthFrom) &&
          current <= (yearTo * 100 + monthTo) &&
          (frequency == Frequency.Annually ? j == monthFrom : true)
        ) {
          totalNet += item.category * item.amount * (frequency == 0 ? 4 : 1);
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
  const today = new Date();
  const todayYear = today.getFullYear();
  const [endYear, setEndYear] = useState<number>(todayYear + 2);

  const handleInputChange = (ev: React.FormEvent<HTMLInputElement>) => {
    const _endYear = Number((ev.target as HTMLInputElement).value);
    setEndYear(_endYear);
  };

  return (
    <div className={`report card`}>
      <h2>Report</h2>
      <form>
        <div>
          <label>Range</label>
          <span>
            {`${today.getFullYear()} - `}
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
