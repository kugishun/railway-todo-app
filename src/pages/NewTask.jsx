import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { url } from '../const';
import { Header } from '../components/Header';
import './newTask.css';
import { useNavigate } from 'react-router-dom';
import CustomTimePicker from './TimePicker';

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const [limitDate,setDate] = useState(null);
  const navigate = useNavigate();
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleSelectList = (id) => setSelectListId(id);
  const onCreateTask = () => {
    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: limitDate
    };
    console.log(data)
    axios
      .post(`https://${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`);
      });
  };

  const changeValue = (newValue) =>{
    // const Year = newValue.year();
    // const Month = ('00' + (newValue.month()+1)).slice(-2);
    // const Day = ('00' + newValue.date()).slice(-2);
    // const Hour = ('00' + newValue.hour()).slice(-2);
    // const Minute = ('00' + newValue.minute()).slice(-2);
    // const Second = ('00' + newValue.second()).slice(-2);
    // const newDate = `${Year}-${Month}-${Day}T${Hour}:${Minute}:${Second}+09:00`;
    const JSTDate = new Date(newValue);
    console.log(JSTDate.toISOString());
    console.log(newValue);
    setDate(JSTDate.toISOString());
    // console.log(value.date());
  }

  useEffect(() => {
    axios
      .get(`https://${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
        setSelectListId(res.data[0]?.id);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select
            onChange={(e) => handleSelectList(e.target.value)}
            className="new-task-select-list"
          >
            {lists.map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="new-task-title"
          />
          <br/>
          <label>期限</label>
          <br/>
              <CustomTimePicker changeValue={changeValue} value={limitDate}/>
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="new-task-detail"
          />
          <br />
          <button
            type="button"
            className="new-task-button"
            onClick={onCreateTask}
          >
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
