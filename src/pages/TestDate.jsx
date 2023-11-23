import React,{useState} from 'react';
import CustomTimePicker from './TimePicker';

export const TestDate = () => {
  const [value, setValue] = useState(null);
  const changeValue = (newValue) =>{
    setValue(newValue)
    console.log(value);
  }

  return(
    <div>
      <CustomTimePicker changeValue = {changeValue} value={value}/>
    </div>
  )
};
