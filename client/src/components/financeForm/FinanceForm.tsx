import React, { useContext, useRef } from 'react';
import {Context} from "../baseLayout/BaseLayout"
import {Category} from "../interfaces";
import styles from './financeForm.module.css';

interface Props {
  header: string;
  category: Category;
  handleAddFunction(name: string, amount: number, category: Category): void;
  handleDeleteFunction(key: string): void;
}

const FinanceForm: React.FC<Props> = ({header, category, handleAddFunction, handleDeleteFunction}: Props) => {
  const items = useContext(Context).items.filter(item => item.category == category);
  const nameInput = useRef<HTMLInputElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    
    if (
      nameInput.current == null ||
      amountInput.current == null ||
      nameInput.current.value == "" ||
      amountInput.current.value == ""
    ) {
      return;
    }

    handleAddFunction(
      nameInput.current.value,
      Number(amountInput.current.value),
      category
    );

    nameInput.current.value = "";
    amountInput.current.value = "";
  }

  const handleDeleteClick = (key: string) => {
    handleDeleteFunction(key);
  }

  return (
    <div className={`${styles.financeForm} card`}>
      <h2>{header}</h2>
      <form className="wrap" onSubmit={(ev) => handleFormSubmit(ev)}>
        <div>
          <label>Name</label>
          <input ref={nameInput} defaultValue="test" type="text"></input>
        </div>
        <div>
          <label>Amount</label>
          <input ref={amountInput} defaultValue="100" type="number"></input>
        </div>
        <button type="submit">Add</button>
      </form>
      <hr></hr>
      {items.length && <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Frequency</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
        {items.map(item =>
          <tr key={item.key}>
            <td>{item.name}</td>
            <td>monthly</td>
            <td>{item.amount}</td>
            <td align="right">
              <button onClick={() => handleDeleteClick(item.key)}>X</button>
            </td>
          </tr>
        )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td>{items.reduce((sum, item) => sum + item.amount, 0)}</td>
          </tr>
        </tfoot>
      </table> || ""}
    </div>
  );
}

export default FinanceForm;
