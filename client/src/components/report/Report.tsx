import React, { useState } from "react";
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import { IFinanceItem, IFinanceParams, ITimeSeries } from "../../utils/interfaces";
import TimeSeriesChart from "../timeSeriesChart/timeSeriesChart";
import dataAsTimeSeries from "../../utils/dataAsTimeSeries";

interface IProps {
  items: IFinanceItem[];
  params: IFinanceParams;
}

const Report: React.FC<IProps> = ({ items, params }: IProps) => {
  const today = dayjs();
  const [endYear, setEndYear] = useState<number>(today.year() + 10);

  const yearsOnly = (timeSeries: ITimeSeries): ITimeSeries => {
    let _timeSeries: ITimeSeries = {};
    const entries = Object.entries(timeSeries);
    let i: number = 0;

    while (i < entries.length) {
      const year: string = entries[i][0].split(" ")[1];

      if (today.year() === Number(year)) {
        if (i === 0) {
          _timeSeries[year] = entries[i][1];
        }
        i += 1;
      } else if (today.year() < Number(year)) {
        _timeSeries[year] = entries[i][1];
        i += 12;
      }
    }

    return _timeSeries;
  }

  // TODO: consistencies, as number, Number, parseInt
  return (
    <Stack className="report card" spacing={3}>
      <h3>Report</h3>
      <Box paddingX={5}>
        <Slider
          defaultValue={today.year() + 10}
          valueLabelDisplay="auto"
          step={1}
          marks={[
            {value: today.year(), label: today.year()},
            {value: today.year() + 30, label: today.year() + 30}
          ]}
          min={today.year() + 1}
          max={today.year() + 30}
          onChange={(e) => setEndYear(Number((e.target as HTMLInputElement).value))}
        ></Slider>
      </Box>
      <TimeSeriesChart
        series={yearsOnly(dataAsTimeSeries(items, params.roi, params.inflation, today, endYear))}
        startYear={today.year()}
        endYear={endYear}
      />
    </Stack>
  );
};

export default Report;
