import React from "react";
import { render, screen } from "@testing-library/react";
import Report, { dataAsTimeSeries } from "../src/components/report/Report";
import { v4 as uuidv4 } from "uuid";
import { IFinanceItem } from "src/components/interfaces";

const sampleItems: IFinanceItem[] = [];

const sampleParams = {
  roi: 10,
  salaryIncrease: 0,
  inflation: 2,
};

const yearParams = {
  startYear: 2022,
  endYear: 2025,
};
// it('renders learn   react link', () => {
//   const {debug, getByTestId} = render(<Report items={sampleItems} params={sampleParams}/>);
//   // const linkElement = screen.getByText(/learn react/i);
//   // expect(linkElement).toBeInTheDocument();
//   debug()
// const { debug, getByTestId } = render(
//   <Report items={sampleItems} params={sampleParams} />
// );
// const linkElement = screen.getByText(/learn react/i);
// expect(linkElement).toBeInTheDocument();
// debug();
// const props = { items: sampleItems, params: sampleParams };
// const report = Report(props);
// const proto = Object.getPrototypeOf(report);
// expect(proto.dataAsTimeSeries());
// });

it("selecting no years or months equates to selecting them all", () => {
  const expected = { "Dec 2024": 2883 };
  const annualModifier = 1.1;
  const endYear = 2024;
  const inputNone = [
    {
      key: "facee0c0-532b-400c-b7ea-f5f7ceeb3b98",
      name: "test",
      frequency: 1,
      amount: 100,
      category: 1,
    },
  ];
  const inputAll = [
    {
      key: "facee0c0-532b-400c-b7ea-f5f7ceeb3b98",
      name: "test",
      frequency: 1,
      amount: 100,
      category: 1,
    },
  ];

  const resNone = dataAsTimeSeries(inputNone, annualModifier, endYear);
  const resAll = dataAsTimeSeries(inputAll, annualModifier, endYear);

  expect(Object.keys(resNone).length).toEqual(27);
  expect(resNone).toEqual(resAll);
  expect(resNone["Dec 2024"]).toEqual(expected["Dec 2024"]);
});

it("correct result with one month selected", () => {});

it("correct result with one year selected", () => {});

it("correct result with a couple of years and months selected", () => {});

it("correct result with all years and months selected", () => {});

it("cannot select months without selecting years", () => {});

it("cannot select years without selecting months", () => {});
