import React, { useState, createContext } from 'react';
import FinanceForm from '../financeForm/FinanceForm';
import ParamsForm from '../paramsForm/ParamsForm';
import Report from '../report/Report';
import { IFinanceItem, IFinanceParams } from '../../utils/interfaces';
import './baseLayout.css';

interface ICtx {
  items: IFinanceItem[];
  params: IFinanceParams;
}

const initialParams = {
  roi: 12,
  salaryIncrease: 0,
  inflation: 2,
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
      <main className="baseLayout center">
        <div className="wrapper">
          <FinanceForm handleAddFunction={addItem} handleDeleteFunction={deleteItem}/>
          <ParamsForm handleUpdateClick={updateParams} />
          <Report items={items} params={params} />
        </div>
      </main>
    </Context.Provider>
  );
}

export default BaseLayout;
