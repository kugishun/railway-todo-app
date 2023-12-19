import React,{useState} from 'react';
import CustomTimePicker from './TimePicker';

export const TestDate = () => {
  const [value, setValue] = useState(null);
  const changeValue = (newValue) =>{
    const test = new Date(newValue);
    setValue(newValue)
    console.log(value)
    console.log(test.toISOString());
  }

  // const Year = value.year();
  // const Month = value.month()+1;
  // const Date = value.date();
  // const Hour = value.hour();
  // const Minute = value.minute();

  return(
    <div>
      <input type="date"/>
      <input type="time"/>
      <CustomTimePicker changeValue = {changeValue} value={value}/>
      {/* <p>{Year+"/"+Month +"/"+Date+" "+Hour+":"+Minute}</p> */}
    </div>
  )
};
