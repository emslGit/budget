import { Frequency, MONTHS } from "./constants";
import { Dayjs } from "dayjs";
import { IFinanceItem, ITimeSeries } from "./interfaces";

const dataAsTimeSeries = (
  items: IFinanceItem[],
  roi: number,
  inflation: number,
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

        // only if item within time range, and only run annual once a year
        if (
          current >= (yearFrom * 100 + monthFrom) &&
          current <= (yearTo * 100 + monthTo) &&
          (frequency == Frequency.Annually ? j == monthFrom : true)
        ) {
          totalNet += item.category * item.amount * (frequency === Frequency.Weekly ? 4 : 1);
        }
      }

      totalNetArr[`${MONTHS[j]} ${i}`] = Math.round(totalNet);
    }

    totalNet = totalNet * (1 + ((totalNet >= 0) ? (roi - inflation) : inflation)/100);
  }

  return totalNetArr;
};

export default dataAsTimeSeries;