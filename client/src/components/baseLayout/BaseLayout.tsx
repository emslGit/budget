import React, { useState, createContext } from 'react';
import FinanceForm from '../financeForm/FinanceForm';
import ParamsForm from '../paramsForm/ParamsForm';
import Report from '../report/Report';
import styles from './baseLayout.module.css';
import { IFinanceItem, IFinanceParams, Category } from '../interfaces';

interface ICtx {
  items: IFinanceItem[];
  params: IFinanceParams;
}

const initialParams = {
  roi: 0,
  salaryIncrease: 0,
  inflation: 0,
}

export const Context = createContext<ICtx>({
  items: [],
  params: {}
});

const BaseLayout: React.FC = () => {
  const [items, setItems] = useState<IFinanceItem[]>([]);
  const [params, setParams] = useState<IFinanceParams>(initialParams);
  
  const addItem = (financeItem: IFinanceItem) => {
    setItems([financeItem, ...items]);
  }

  const deleteItem = (key: string) => {
    setItems(items.filter(item => item.key != key));
  }

  const updateParams = (params: IFinanceParams) => {
    setParams(params);
  }

  return (
    <Context.Provider value={{items: items, params: params}}>
      <div className={`${styles.baseLayout} center`}>
        <div className={styles.wrapper}>
          <h1>Budget</h1>
          <FinanceForm header="Stuff" handleAddFunction={addItem} handleDeleteFunction={deleteItem}/>
          <ParamsForm handleUpdateClick={updateParams} />
          <Report />
        </div>
      </div>
    </Context.Provider>
  );
}

export default BaseLayout;
