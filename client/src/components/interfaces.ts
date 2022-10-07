export enum Category {
  Income = 1,
  Expense = -1,
}

export interface IFinanceItem {
  key: string;
  name: string;
  amount: number;
  category: Category;
}

export interface IFinanceParams {
  [param: string]: number;
}
