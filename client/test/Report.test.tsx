import React from "react";
import { render, screen } from "@testing-library/react";
import Report, { dataAsTimeSeries } from "../src/components/report/Report";
import { v4 as uuidv4 } from "uuid";
import { Frequency, Category } from "../src/utils/constants";


it("selecting no years or months equates to selecting them all", () => {
  const expected = { "Dec 2024": 2883 };
  const annualModifier = 1.1;
  const today = new Date(2022, 9, 1);
  const endYear = 2024;
  const inputNone = [
    {
      key: uuidv4(),
      name: "test income",
      frequency: Frequency.Monthly,
      amount: 100,
      category: Category.Income,
    },
  ];
  const inputAll = [
    {
      key: uuidv4(),
      name: "test income",
      frequency: Frequency.Monthly,
      amount: 100,
      category: Category.Income,
    },
  ];
  const resNone = dataAsTimeSeries(inputNone, annualModifier, today, endYear);
  const resAll = dataAsTimeSeries(inputAll, annualModifier, today, endYear);
  expect(Object.keys(resNone).length).toEqual(27);
  expect(resNone).toEqual(resAll);
  expect(resNone["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with one month selected", () => {
  const expected = { "Dec 2024": 169 };
  const annualModifier = 0.92;
  const today = new Date(2022, 9, 1);
  const endYear = 2024;
  const inputOneMonth = [
    {
      key: uuidv4(),
      name: "test income",
      frequency: Frequency.Monthly,
      amount: 200,
      category: Category.Income,
      yearFrom: 2022,
      monthFrom: 10,
      yearTo: 2022,
      monthTo: 10,
    },
  ];

  const resOneMonth = dataAsTimeSeries(inputOneMonth, annualModifier, today, endYear);
  expect(Object.keys(resOneMonth).length).toEqual(27);
  expect(resOneMonth["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with one year selected", () => {
  const expected = { "Dec 2024": 1430 };
  const annualModifier = 1.08;
  const today = new Date(2022, 9, 1);
  const endYear = 2024;
  const inputOneYear = [
    {
      key: uuidv4(),
      name: "test income",
      frequency: Frequency.Monthly,
      amount: 100,
      category: Category.Income,
      yearFrom: 2022,
      monthFrom: 10,
      yearTo: 2023,
      monthTo: 10,
    },
  ];

  const resOneMonth = dataAsTimeSeries(inputOneYear, annualModifier, today, endYear);
  expect(Object.keys(resOneMonth).length).toEqual(27);
  expect(resOneMonth["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with different months and years selected", () => {
  const expected = { "Dec 2026": 3246 };
  const annualModifier = 1.1;
  const today = new Date(2022, 9, 1);
  const endYear = 2026;
  const inputVarious = [{
    key: uuidv4(),
    name: "test",
    frequency: Frequency.Weekly,
    amount: 25,
    category: Category.Income,
    yearFrom: 2023,
    monthFrom: 2,
    yearTo: 2025,
    monthTo: 3,
  }];

  const resOneMonth = dataAsTimeSeries(inputVarious, annualModifier, today, endYear);
  expect(Object.keys(resOneMonth).length).toEqual(51);
  expect(resOneMonth["Dec 2026"]).toEqual(expected["Dec 2026"]);
});

it("correct result with both income and expense", () => {
  const expected = { "Dec 2024": 2052 };
  const annualModifier = 1.1;
  const today = new Date(2022, 9, 1);
  const endYear = 2024;
  const inputOneYear = [
    {
      key: uuidv4(),
      name: "test income",
      frequency: Frequency.Weekly,
      amount: 25,
      category: Category.Income,
    },
    {
      key: uuidv4(),
      name: "test expense",
      frequency: Frequency.Monthly,
      amount: 50,
      category: Category.Expense,
      yearFrom: 2022,
      monthFrom: 11,
      yearTo: 2024,
      monthTo: 1,
    },
  ];

  const resOneMonth = dataAsTimeSeries(inputOneYear, annualModifier, today, endYear);
  expect(Object.keys(resOneMonth).length).toEqual(27);
  expect(resOneMonth["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with annual frequencies", () => {
  const expected = { "Dec 2025": 231 };
  const annualModifier = 1.1;
  const today = new Date(2022, 9, 1);
  const endYear = 2025;
  const inputOneYear = [
    {
      key: uuidv4(),
      name: "test income",
      frequency: Frequency.Annually,
      amount: 100,
      category: Category.Income,
      yearFrom: 2022,
      monthFrom: 10,
      yearTo: 2024,
      monthTo: 9,
    },
    {
      key: uuidv4(),
      name: "test expense",
      frequency: Frequency.Annually,
      amount: 10,
      category: Category.Expense,
      yearFrom: 2022,
      monthFrom: 9,
      yearTo: 2024,
      monthTo: 9,
    },
  ];

  const resOneMonth = dataAsTimeSeries(inputOneYear, annualModifier, today, endYear);
  expect(Object.keys(resOneMonth).length).toEqual(39);
  expect(resOneMonth["Dec 2025"]).toEqual(expected["Dec 2025"]);
});

// System tests
it("cannot select months without selecting years", () => {});

it("cannot select years without selecting months", () => {});

// it('renders learn   react link', () => {
//   const {debug, getByTestId} = render(<Report items={sampleItems} params={sampleParams}/>);
//   // const linkElement = screen.getByText(/learn react/i);
//   // expect(linkElement).toBeInTheDocument();
//   debug()
// );
