import React, { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {MobileDatePicker} from '@mui/x-date-pickers/MobileDatePicker';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import {Context} from "../baseLayout/BaseLayout"
import {Frequency, Category} from '../../utils/constants';
import {IFinanceItem} from "../../utils/interfaces";

interface IProps {
  handleAddFunction(financeItem: IFinanceItem): void;
}

const defaultFinanceItem: IFinanceItem = {
  key: "",
  itemName: "test",
  frequency: Frequency.Monthly,
  amount: 100,
  category: Category.Income,
  dateFrom: null,
  dateTo: null,
}

const FinanceForm: React.FC<IProps> = ({handleAddFunction}: IProps) => {
  const {items} = useContext(Context);
  const [itemName, setItemName] = useState<string>(defaultFinanceItem.itemName);
  const [amount, setAmount] = useState<number>(defaultFinanceItem.amount);
  const [category, setCategory] = useState<Category>(defaultFinanceItem.category);
  const [frequency, setFrequency] = useState<Frequency>(defaultFinanceItem.frequency);
  const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(defaultFinanceItem.dateFrom);
  const [dateTo, setDateTo] = React.useState<Dayjs | null>(defaultFinanceItem.dateTo);
  const today = dayjs();

  const handleSubmit = () => {

    if (itemName === "" || amount === 0) {
      return;
    }
    
    handleAddFunction({
      itemName: itemName,
      amount: amount,
      category: category,
      frequency: frequency,
      dateFrom: dateFrom,
      dateTo: dateTo,
      key: uuidv4(),
    });
  }

  return (
    <Stack className="financeForm card" spacing={3}>
      <h3>Add Income or Expense</h3>
      <TextField
        fullWidth
        size="small"
        id="name-input"
        label="Name"
        variant="outlined"
        defaultValue={defaultFinanceItem.itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <TextField
        fullWidth
        size="small"
        id="amount-input"
        label="Amount"
        variant="outlined"
        defaultValue={defaultFinanceItem.amount}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">$</InputAdornment>
          ),
        }}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
      <ToggleButtonGroup
        size="small"
        fullWidth
        value={category}
        exclusive
        onChange={(e) => setCategory(parseInt((e.target as HTMLButtonElement).value))}
      >
        <ToggleButton color="primary" value={Category.Income}>Income</ToggleButton>
        <ToggleButton color="secondary" value={Category.Expense}>Expense</ToggleButton>
      </ToggleButtonGroup>
      <FormControl fullWidth size="small">
        <InputLabel id="frequency-select-label">Frequency</InputLabel>
        <Select
          labelId="frequency-select-label"
          id="frequency-select"
          label="Frequency"
          defaultValue={defaultFinanceItem.frequency}
          onChange={(e) => setFrequency(e.target.value as number)}
        >
          <MenuItem value={Frequency.Once}>Once</MenuItem>
          <MenuItem value={Frequency.Weekly}>Weekly</MenuItem>
          <MenuItem value={Frequency.Monthly}>Monthly</MenuItem>
          <MenuItem value={Frequency.Annually}>Annually</MenuItem>
        </Select>
      </FormControl>
      <Stack direction="row" spacing={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            inputFormat="MMM YYYY"
            views={['year', 'month']}
            label="From"
            minDate={today}
            value={dateFrom}
            onChange={(date) => setDateFrom(date)}
            renderInput={(params) => <TextField {...params} fullWidth size="small"/>}
          />
          <DatePicker
            inputFormat="MMM YYYY"
            views={['year', 'month']}
            label="To"
            minDate={today}
            value={dateTo}
            onChange={(date) => setDateTo(date)}
            renderInput={(params) => <TextField {...params} fullWidth size="small"/>}
          />
        </LocalizationProvider>
      </Stack>
      <Button fullWidth variant="contained" onClick={() => handleSubmit()}>
        Add
      </Button>
    </Stack>
  );
}

export default FinanceForm;
