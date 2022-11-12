import { Dayjs } from "dayjs";
import { Category, Frequency } from "./constants";

export interface IFinanceItem {
  key: string;
  itemName: string;
  amount: number;
  category: Category;
  frequency: Frequency,
  dateFrom: Dayjs | null,
  dateTo: Dayjs | null,
}

export interface IFinanceParams {
  [param: string]: number;
}

export interface ITimeSeries {
  [key: string]: number
};