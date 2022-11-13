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

  const editItem = (financeItem: IFinanceItem) => {
    const filtered = items.filter(item => item.key != financeItem.key)
    setItems([financeItem, ...filtered]);
  }

  const updateParams = (params: IFinanceParams) => {
    setParams(params);
  }

  return (
    <Context.Provider value={{items: items, params: params}}>
      <main className="baseLayout center">
        <Stack direction="column" sx={{width: 1500 }} spacing={2}>
          <Stack direction="row" spacing={2}>
            <Stack sx={{width: 1 }}>
              <Report items={items} params={params} />
            </Stack>
            <Stack sx={{width: 675}} spacing={2}>
              <ParamsForm handleUpdateClick={updateParams} />
              <FinanceForm handleAddFunction={addItem}/>
            </Stack>
          </Stack>
          <Stack sx={{width: 1}}>
            <FinanceTable handleDeleteFunction={deleteItem} handleEditFunction={editItem}/>
          </Stack>
        </Stack>
      </main>
    </Context.Provider>
  );
}

export default BaseLayout;
