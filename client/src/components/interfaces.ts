export enum Category {
  Income = 1,
  Unset = 0,
  Expense = -1,
}

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