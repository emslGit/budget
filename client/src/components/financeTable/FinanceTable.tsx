import React, { useContext, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

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

import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';

import {Context} from "../baseLayout/BaseLayout"
import {FREQUENCY, Frequency, CATEGORY, Category} from '../../utils/constants';
import {IFinanceItem} from "../../utils/interfaces";

interface IProps {
  handleDeleteFunction(key: string): void;
  handleEditFunction(financeItem: IFinanceItem): void;
}

const FinanceTable: React.FC<IProps> = ({handleDeleteFunction, handleEditFunction}: IProps) => {
  const {items} = useContext(Context);
  const [keyToEdit, setKeyToEdit] = useState<string>("");
  const today = dayjs();

  const [itemName, setItemName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<Category>(1);
  const [frequency, setFrequency] = useState<Frequency>(0);
  const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = React.useState<Dayjs | null>(null);

  const handleDeleteClick = (key: string) => {
    handleDeleteFunction(key);
  }

  const handleEditClick = (item: IFinanceItem) => {
    if (keyToEdit.length) {
      handleEditFunction({
        itemName: itemName,
        amount: amount,
        category: category,
        frequency: frequency,
        dateFrom: dateFrom,
        dateTo: dateTo,
        key: keyToEdit,
      });
      setKeyToEdit("");
    } else {
      setKeyToEdit(item.key);
      setItemName(item.itemName);
      setAmount(item.amount);
      setCategory(item.category);
      setFrequency(item.frequency);
      setDateFrom(item.dateFrom);
      setDateTo(item.dateTo);
    }
  }

  return (
    <>
      {items.length && <TableContainer className="card">
        <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .sort((itemA: IFinanceItem, itemB: IFinanceItem) => itemA.key >= itemB.key ? - 1 : 1)
              .map((item: IFinanceItem) => (
              <TableRow key={item.key}>
                {(keyToEdit === item.key) && <>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      id="name-input"
                      label="Name"
                      variant="outlined"
                      defaultValue={item.itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                  <FormControl fullWidth size="small">
                    <InputLabel id="category-select-label">Category</InputLabel>
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        label="Category"
                        defaultValue={item.category}
                        onChange={(e) => setCategory(e.target.value as number)}
                      >
                        <MenuItem value={Category.Income}>Income</MenuItem>
                        <MenuItem value={Category.Expense}>Expense</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth size="small">
                      <InputLabel id="frequency-select-label">Frequency</InputLabel>
                      <Select
                        labelId="frequency-select-label"
                        id="frequency-select"
                        label="Frequency"
                        defaultValue={item.frequency}
                        onChange={(e) => setFrequency(e.target.value as number)}
                      >
                        <MenuItem value={Frequency.Once}>Once</MenuItem>
                        <MenuItem value={Frequency.Weekly}>Weekly</MenuItem>
                        <MenuItem value={Frequency.Monthly}>Monthly</MenuItem>
                        <MenuItem value={Frequency.Annually}>Annually</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        inputFormat="MMM YYYY"
                        views={['year', 'month']}
                        label="From"
                        minDate={today}
                        value={item.dateFrom}
                        onChange={(date) => setDateFrom(date)}
                        renderInput={(params) => <TextField {...params} fullWidth size="small"/>}
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        inputFormat="MMM YYYY"
                        views={['year', 'month']}
                        label="To"
                        minDate={today}
                        value={item.dateTo}
                        onChange={(date) => setDateTo(date)}
                        renderInput={(params) => <TextField {...params} fullWidth size="small"/>}
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      id="amount-input"
                      label="Amount"
                      variant="outlined"
                      defaultValue={item.amount}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      onChange={(e) => setAmount(parseInt(e.target.value))}
                    />
                  </TableCell>
                </> || <>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>{CATEGORY[item.category]}</TableCell>
                  <TableCell>{FREQUENCY[item.frequency]}</TableCell>
                  <TableCell>{item.dateFrom?.format('MMM YYYY') || ""}</TableCell>
                  <TableCell>{item.dateTo?.format('MMM YYYY') || ""}</TableCell>
                  <TableCell>{item.category * item.amount}</TableCell>
                </>}
                <TableCell align="right">
                  <IconButton onClick={() => handleEditClick(item)}>
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
              <TableCell colSpan={5}>Net Annual Change</TableCell>
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
    </>
  );
}

export default FinanceTable;
