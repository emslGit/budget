import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {Context} from "../baseLayout/BaseLayout"
import {MONTHS, Category} from '../constants';
import {IFinanceItem} from "../interfaces";
import './financeForm.css';


interface IProps {
  header: string;
  handleAddFunction(financeItem: IFinanceItem): void;
  handleDeleteFunction(key: string): void;
}

const defaultFormState: IFinanceItem = {
  key: "",
  name: "test",
  frequency: 1,
  amount: 100,
  category: Category.Income,
}

const FREQUENCY = [
  "Weekly",
  "Monthly",
  "Annually",
]

const FinanceForm: React.FC<IProps> = ({header, handleAddFunction, handleDeleteFunction}: IProps) => {
  const {items} = useContext(Context);
  const [formState, setFormState] = useState<IFinanceItem>(defaultFormState);

  const handleChange = (ev: React.FormEvent) => {
    const target = ev.target as HTMLInputElement

    setFormState({
      ...formState,
      [target.name]: (target.type === "string") ? target.value : parseInt(target.value),
    });
  }

  const handleFormSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    if (formState.name === "" || formState.amount === 0) {
      return;
    }

    handleAddFunction({
      ...formState,
      key: uuidv4(),
    });
  }

  const handleDeleteClick = (key: string) => {
    handleDeleteFunction(key);
  }

  return (
    <div className="financeForm card">
      <h2>{header}</h2>
      <form className="wrap" onSubmit={(ev) => handleFormSubmit(ev)}>
        <div className="mainOptions">
          <div className="inputGroup">
            <label>Name</label>
            <input name="name" type="text" defaultValue={defaultFormState.name} onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="inputGroup">
            <label>Amount</label>
            <input name="amount" defaultValue={defaultFormState.amount} type="number" onChange={(e) => handleChange(e)}></input>
          </div>
          <div className="selectGroup">
            <label>Category</label>
            <select name="category" defaultValue={Category.Income} onChange={(e) => handleChange(e)}>
              <option value={Category.Income}>Income</option>
              <option value={Category.Expense}>Expense</option>
            </select>
          </div>
          <button type="submit">Add</button>
        </div>
        <div className="extraOptions">
          <div className="selectGroup">
            <label>Frequency</label>
            <select name="frequency" defaultValue={defaultFormState.frequency} onChange={(e) => handleChange(e)}>
              <option value={0}>Weekly</option>
              <option value={1}>Monthly</option>
              <option value={2}>Annually</option>
            </select>
          </div>
          <div className="selectGroup">
            <label>From</label>
            <input name="yearFrom" type="number" className="yearInput" onChange={(e) => handleChange(e)}></input>
            <select name="monthFrom" onChange={(e) => handleChange(e)}>
              {MONTHS.map((month, i) => 
                <option key={i} value={i}>{month}</option>
              )}  
            </select>
            <label>to</label>
            <input name="yearTo" type="number" className="yearInput" onChange={(e) => handleChange(e)}></input>
            <select name="monthTo" onChange={(e) => handleChange(e)}>
              {MONTHS.map((month, i) => 
                <option key={i} value={i}>{month}</option>
              )}
            </select>
          </div>
          <div className="inputGroup">
            <label>Label</label>
            <input name="label" type="text" defaultValue={defaultFormState.label} onChange={(e) => handleChange(e)}></input>
          </div>
        </div>
      </form>
      <hr></hr>
      {items.length && <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Frequency</th>
            <th>Amount</th>
            <th>From</th>
            <th>To</th>
            <th>Label</th>
          </tr>
        </thead>
        <tbody>
        {items.map(item =>
          <tr key={item.key}>
            <td>{item.name}</td>
            <td>{FREQUENCY[item.frequency]}</td>
            <td>{item.category === Category.Expense ? "\u2212" : "\u002B"} {item.amount}</td>
            <td>{item.monthFrom && MONTHS[item.monthFrom]} {item.yearFrom}</td>
            <td>{item.monthTo && MONTHS[item.monthTo]} {item.yearTo}</td>
            <td>{item.label}</td>
            <td align="right">
              <button onClick={() => handleDeleteClick(item.key)}>X</button>
            </td>
          </tr>
        )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total Annually</td>
            <td>{items.reduce((sum, item) => {
                const multiplied = (item.category === Category.Expense ? -1 : 1) * item.amount;
                switch(item.frequency) {
                  case 0:
                    return 52 * multiplied + sum;
                  case 1:
                    return 12 * multiplied + sum;
                  default:
                    return multiplied + sum;
                }
              }, 0)}
            </td>
          </tr>
        </tfoot>
      </table> || ""}
    </div>
  );
}

export default FinanceForm;
