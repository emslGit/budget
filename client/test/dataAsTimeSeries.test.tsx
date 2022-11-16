import dayjs from "dayjs";
import dataAsTimeSeries from "../src/utils/dataAsTimeSeries";
import { v4 as uuidv4 } from "uuid";
import { Frequency, Category } from "../src/utils/constants";

it("selecting no years or months equates to selecting them all", () => {
  const expected = { "Dec 2024": 2883 };
  const roi = 12;
  const inflation = 2;
  const today = dayjs('2022-10-01');
  const endYear = 2024;
  const inputNone = [
    {
      key: uuidv4(),
      itemName: "test income",
      frequency: Frequency.Monthly,
      amount: 100,
      category: Category.Income,
      dateFrom: null,
      dateTo: null,
    },
  ];
  const inputAll = [
    {
      key: uuidv4(),
      itemName: "test income",
      frequency: Frequency.Monthly,
      amount: 100,
      category: Category.Income,
      dateFrom: null,
      dateTo: null,
    },
  ];

  const resNone = dataAsTimeSeries(inputNone, roi, inflation, today, endYear);
  const resAll = dataAsTimeSeries(inputAll, roi, inflation, today, endYear);
  expect(Object.keys(resNone).length).toEqual(27);
  expect(resNone).toEqual(resAll);
  expect(resNone["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with one month selected", () => {
  const expected = { "Dec 2024": 169 };
  const roi = 0;
  const inflation = 8;
  const today = dayjs('2022-10-01');
  const endYear = 2024;
  const input = [
    {
      key: uuidv4(),
      itemName: "test income",
      frequency: Frequency.Monthly,
      amount: 200,
      category: Category.Income,
      dateFrom: dayjs('2022-10-01'),
      dateTo: dayjs('2022-10-01'),
    },
  ];

  const res = dataAsTimeSeries(input, roi, inflation, today, endYear);
  expect(Object.keys(res).length).toEqual(27);
  expect(res["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with one year selected", () => {
  const expected = { "Dec 2024": 1430 };
  const roi = 10;
  const inflation = 2;
  const today = dayjs('2022-10-01');
  const endYear = 2024;
  const input = [
    {
      key: uuidv4(),
      itemName: "test income",
      frequency: Frequency.Monthly,
      amount: 100,
      category: Category.Income,
      dateFrom: dayjs('2022-10-01'),
      dateTo: dayjs('2023-10-01'),
    },
  ];

  const res = dataAsTimeSeries(input, roi, inflation, today, endYear);
  expect(Object.keys(res).length).toEqual(27);
  expect(res["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with different months and years selected", () => {
  const expected = { "Dec 2026": 3246 };
  const roi = 14;
  const inflation = 4;
  const today = dayjs('2022-10-01');
  const endYear = 2026;
  const input = [{
    key: uuidv4(),
    itemName: "test",
    frequency: Frequency.Weekly,
    amount: 25,
    category: Category.Income,
    dateFrom: dayjs('2023-02-01'),
    dateTo: dayjs('2025-03-01'),
  }];

  const res = dataAsTimeSeries(input, roi, inflation, today, endYear);
  expect(Object.keys(res).length).toEqual(51);
  expect(res["Dec 2026"]).toEqual(expected["Dec 2026"]);
});

it("correct result with both income and expense", () => {
  const expected = { "Dec 2024": 2052 };
  const roi = 10;
  const inflation = 0;
  const today = dayjs('2022-10-01');
  const endYear = 2024;
  const input = [
    {
      key: uuidv4(),
      itemName: "test income",
      frequency: Frequency.Weekly,
      amount: 25,
      category: Category.Income,
      dateFrom: null,
      dateTo: dayjs('2024-12-31'),
    },
    {
      key: uuidv4(),
      itemName: "test expense",
      frequency: Frequency.Monthly,
      amount: 50,
      category: Category.Expense,
      dateFrom: dayjs('2022-11-01'),
      dateTo: dayjs('2024-01-01'),
    },
  ];

  const res = dataAsTimeSeries(input, roi, inflation, today, endYear);
  expect(Object.keys(res).length).toEqual(27);
  expect(res["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with annual frequencies", () => {
  const expected = { "Dec 2025": 231 };
  const roi = 12;
  const inflation = 2;
  const today = dayjs('2022-10-01');
  const endYear = 2025;
  const input = [
    {
      key: uuidv4(),
      itemName: "test income",
      frequency: Frequency.Annually,
      amount: 100,
      category: Category.Income,
      dateFrom: dayjs('2022-10-01'),
      dateTo: dayjs('2024-09-01'),
    },
    {
      key: uuidv4(),
      itemName: "test expense",
      frequency: Frequency.Annually,
      amount: 10,
      category: Category.Expense,
      dateFrom: dayjs('2022-09-01'),
      dateTo: dayjs('2024-09-01'),
    },
  ];

  const res = dataAsTimeSeries(input, roi, inflation, today, endYear);
  expect(Object.keys(res).length).toEqual(39);
  expect(res["Dec 2025"]).toEqual(expected["Dec 2025"]);
});

it("roi does not compound negative values", () => {
  const expected = { "Dec 2032": 2780 };
  const roi = 12;
  const inflation = 2;
  const today = dayjs('2022-11-01');
  const endYear = 2034;
  const input = [
    {
      key: uuidv4(),
      itemName: "test income",
      frequency: Frequency.Monthly,
      amount: 100,
      category: Category.Income,
      dateFrom: dayjs('2022-11-01'),
      dateTo: null,
    },
    {
      key: uuidv4(),
      itemName: "test expense",
      frequency: Frequency.Monthly,
      amount: 200,
      category: Category.Expense,
      dateFrom: dayjs('2024-01-01'),
      dateTo: dayjs('2027-12-31'),
    },
  ];

  const res = dataAsTimeSeries(input, roi, inflation, today, endYear);
  expect(Object.keys(res).length).toEqual(146);
  expect(res["Dec 2032"]).toEqual(expected["Dec 2032"]);
});
