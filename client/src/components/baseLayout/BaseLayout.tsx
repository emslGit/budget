import React, { useState, createContext } from 'react';
import FinanceForm from '../financeForm/FinanceForm';
import ParamsForm from '../paramsForm/ParamsForm';
import Report from '../report/Report';
import { IFinanceItem, IFinanceParams } from '../../utils/interfaces';
import './baseLayout.css';
import FinanceTable from '../financeTable/FinanceTable';
import { Stack } from '@mui/system';

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

  const editItem = (key: string) => {
    setItems(items);
  }

  const updateParams = (params: IFinanceParams) => {
    setParams(params);
  }

  return (
    <Context.Provider value={{items: items, params: params}}>
      <main className="baseLayout center">
        <Stack direction="row" spacing={2}>
          <Stack sx={{width: 1000}} className="leftColumn">
            <Report items={items} params={params} />
            <FinanceTable handleDeleteFunction={deleteItem} handleEditFunction={editItem}/>
          </Stack>
          <Stack sx={{width: 400}} spacing={2}>
            <ParamsForm handleUpdateClick={updateParams} />
            <FinanceForm handleAddFunction={addItem}/>
          </Stack>
        </Stack>
      </main>
    </Context.Provider>
  );
}

export default BaseLayout;
