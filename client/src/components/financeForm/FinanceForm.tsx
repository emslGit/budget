import React, { useContext, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {MobileDatePicker} from '@mui/x-date-pickers/MobileDatePicker';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import {Context} from "../baseLayout/BaseLayout"
import {FREQUENCY, Frequency, Category} from '../../utils/constants';
import {IFinanceItem} from "../../utils/interfaces";

interface IProps {
  handleAddFunction(financeItem: IFinanceItem): void;
  handleDeleteFunction(key: string): void;
  handleEditFunction(key: string): void;
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

const FinanceForm: React.FC<IProps> = ({handleAddFunction, handleDeleteFunction, handleEditFunction}: IProps) => {
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

  const handleDeleteClick = (key: string) => {
    handleDeleteFunction(key);
  }

  const handleEditClick = (key: string) => {
    handleEditFunction(key);
  }

  return (
    <Stack className="financeForm card" spacing={3}>
      <h3>Add Income or Expense</h3>
      <TextField
        id="name-input"
        label="Name"
        variant="outlined"
        defaultValue={defaultFinanceItem.itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <TextField
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
        fullWidth
        color="primary"
        value={category}
        exclusive
        onChange={(e) => setCategory(parseInt((e.target as HTMLButtonElement).value))}
      >
        <ToggleButton value={Category.Income}>Income</ToggleButton>
        <ToggleButton value={Category.Expense}>Expense</ToggleButton>
      </ToggleButtonGroup>
      <FormControl fullWidth>
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
          <MobileDatePicker
            inputFormat="MMM YYYY"
            views={['year', 'month']}
            label="From"
            minDate={today}
            value={dateFrom}
            onChange={(date) => setDateFrom(date)}
            renderInput={(params) => <TextField {...params} fullWidth/>}
          />
          <MobileDatePicker
            inputFormat="MMM YYYY"
            views={['year', 'month']}
            label="To"
            minDate={today}
            value={dateTo}
            onChange={(date) => setDateTo(date)}
            renderInput={(params) => <TextField {...params} fullWidth/>}
          />
        </LocalizationProvider>
      </Stack>
      <Button variant="contained" onClick={() => handleSubmit()}>
        Add
      </Button>
      {/* TODO: abstract table */}
      {items.length && <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item: IFinanceItem) => (
              <TableRow key={item.key}>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{FREQUENCY[item.frequency]}</TableCell>
                <TableCell>{item.dateFrom?.format('MMM YYYY') || ""}</TableCell>
                <TableCell>{item.dateTo?.format('MMM YYYY') || ""}</TableCell>
                <TableCell>{item.category * item.amount}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(item.key)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(item.key)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
              <TableCell colSpan={4}>Net Annual Change</TableCell>
              <TableCell>
                {/* TODO: abstract acc */}
                {items.reduce((sum, item) => {
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
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer> || ""}
    </Stack>
  );
}

export default FinanceForm;
