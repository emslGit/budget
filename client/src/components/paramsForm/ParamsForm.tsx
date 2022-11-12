import React, { useState } from 'react';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { IFinanceParams } from '../../utils/interfaces';

interface Props {
  handleUpdateClick(params: IFinanceParams): void;
}

const defaultRoi: number = 12;
const defaultInflation: number = 2;

const ParamsForm: React.FC<Props> = ({handleUpdateClick}: Props) => {
  const [roi, setRoi] = useState<number>(defaultRoi);
  const [inflation, setInflation] = useState<number>(defaultInflation);

  const handleSubmit = () => {
    handleUpdateClick({
      roi: roi || 0,
      inflation: inflation || 0
    });
  }

  // TODO: validate number inputs (all forms, 3 files)
  return (
    <Stack className="paramsForm card" spacing={3}>
      <h3>Parameters</h3>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          id="roi-input"
          label="Roi"
          variant="outlined"
          defaultValue={roi}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">%</InputAdornment>
            ),
          }}
          onChange={(e) => setRoi(parseInt(e.target.value))}
        />
        <TextField
          fullWidth
          id="inflation-input"
          label="Inflation"
          variant="outlined"
          defaultValue={inflation}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">%</InputAdornment>
            ),
          }}
          onChange={(e) => setInflation(parseInt(e.target.value))}
        />
      </Stack>
      <Button variant="contained" onClick={() => handleSubmit()}>
        Update
      </Button>
    </Stack>
  );
}

export default ParamsForm;
