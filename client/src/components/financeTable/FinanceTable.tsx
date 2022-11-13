import React, { useContext } from 'react';

import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';

import {Context} from "../baseLayout/BaseLayout"
import {FREQUENCY, Category} from '../../utils/constants';
import {IFinanceItem} from "../../utils/interfaces";

interface IProps {
  handleDeleteFunction(key: string): void;
  handleEditFunction(key: string): void;
}

const FinanceTable: React.FC<IProps> = ({handleDeleteFunction, handleEditFunction}: IProps) => {
  const {items} = useContext(Context);

  const handleDeleteClick = (key: string) => {
    handleDeleteFunction(key);
  }

  const handleEditClick = (key: string) => {
    handleEditFunction(key);
  }

  return (
    <>
      {items.length && <TableContainer className="card">
        <Table sx={{ minWidth: 650 }} size="small">
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
    </>
  );
}

export default FinanceTable;
