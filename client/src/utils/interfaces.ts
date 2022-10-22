import { Category } from "./constants";

export interface IFinanceItem {
  key: string;
  name: string;
  amount: number;
  label?: string;
  frequency: number,
  monthFrom?: number,
  yearFrom?: number,
  monthTo?: number,
  yearTo?: number,
  category: Category;
}

export interface IFinanceParams {
  [param: string]: number;
}

export interface ITimeSeries {
  [key: string]: number
};