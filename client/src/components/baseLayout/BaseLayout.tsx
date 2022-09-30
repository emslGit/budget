import React, { useState, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FinanceForm from '../financeForm/FinanceForm';
import Report from '../report/Report';
import styles from './baseLayout.module.css';
import { Category } from '../Category';

interface FinanceItem {
  key: string;
  name: string;
  amount: number;
  category: Category;
}

export const Context = createContext<FinanceItem[]>([]);

const BaseLayout: React.FC = () => {
  const [items, setItems] = useState<FinanceItem[]>([]);
  
  const addItem = (name: string, amount: number, category: Category) => {
    const newItem: FinanceItem = {
      key: uuidv4(),
      name: name,
      amount: amount,
      category: category,
    };

    setItems([newItem, ...items]);
  }

  const deleteItem = (key: string) => {
    setItems(items.filter(item => item.key != key));
  }

  return (
    <Context.Provider value={items}>
      <div className={`${styles.baseLayout} center`}>
        <div className={styles.wrapper}>
          <h1>Budget</h1>
          <FinanceForm header="Monthly Income" category={Category.Income} handleAddFunction={addItem} handleDeleteFunction={deleteItem}/>
          <FinanceForm header="Monthly Expenses" category={Category.Expense} handleAddFunction={addItem} handleDeleteFunction={deleteItem}/>
          <Report />
        </div>
      </div>
    </Context.Provider>
  );
}

export default BaseLayout;
