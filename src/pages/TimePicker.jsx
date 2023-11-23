import * as React from 'react';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function ControlledComponent(props) {
  const value = props.value
  const changeValue = (newValue) =>{
    props.changeValue(newValue);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DateTimePicker
          value={value}
          onChange={(newValue) => changeValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
