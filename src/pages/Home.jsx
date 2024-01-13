import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import dayjs from 'dayjs';
import axios from 'axios';
import { Header } from '../components/Header';
import { url } from '../const';
import './home.css';

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo'); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const [time, setTime] = useState([]);
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);

  useEffect(() => {
    axios
      .get(`https://${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== 'undefined') {
      setSelectListId(listId);
      axios
        .get(`https://${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks);
          console.log(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [lists]);

  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`https://${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };
  return (
    <div>
      <Header />
      <main className="taskList">
        <p className="error-message">{errorMessage}</p>
        <div>
          <div className="list-header">
            <h2 className='list-title'>リスト一覧</h2>
            <div className="list-menu">
              <p>
                <Link to="/list/new" className='list-new'>リスト新規作成</Link>
              </p>
              <p>
                <Link to={`/lists/${selectListId}/edit`} className='list-edit'>
                  選択中のリストを編集
                </Link>
              </p>
            </div>
          </div>
          <ul className="list-tab">
            {lists.map((list, key) => {
              const isActive = list.id === selectListId;
              return (
                <div key={key}>
                  <li
                    role='button'
                    key={key}
                    tabIndex={0}
                    aria-pressed={`${isActive ? 'true': 'false'}`}
                    className='list-tab-item'
                    onClick={() => {
                      handleSelectList(list.id)}}
                    onKeyDown={(event) => {
                      if(event.key == 'Enter'){
                        handleSelectList(list.id)
                      }
                    }}
                  >
                    {list.title}
                  </li>
                </div>
              );
            })}
          </ul>
          <div className="tasks">
            <div className="tasks-header">
              <h2 className='task-title'>タスク一覧</h2>
              <Link to="/task/new" className='task-new'>タスク新規作成</Link>
            </div>
            <div className="display-select-wrapper">
              <select
                onChange={handleIsDoneDisplayChange}
                className="display-select"
              >
                <option value="todo">未完了</option>
                <option value="done">完了</option>
              </select>
            </div>
            <Tasks
              tasks={tasks}
              selectListId={selectListId}
              isDoneDisplay={isDoneDisplay}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// 表示するタスク
const Tasks = (props) => {
  const { tasks, selectListId, isDoneDisplay } = props;
  if (tasks === null) return <></>;
  if (isDoneDisplay == 'done') {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => {
            const newTime = new Date(task.limit) - new Date()
            return(
            <li key={key} className="task-item">
              <Link
                to={`/lists/${selectListId}/tasks/${task.id}`}
                className="task-item-link"
              >
                <div className='task-item-information'>
                <span className='task-item-title'>{task.title}</span>
                {task.limit ?
                    <div className='task-item-div'><span className='task-item-time'>{"期限:"+ dayjs(new Date(task.limit)).format('YYYY年MM月DD日HH時mm分:')}</span>
                    <span className='task-item-time'>{"  残り時間:"+ Math.floor(newTime/(1000 * 60 * 60 * 24))+"日" + (Math.floor(newTime/(1000 * 60 * 60)) - Math.floor(newTime/(1000 * 60 * 60 * 24)) * 24) + "時間" + (Math.floor(newTime/(1000*60)) - (Math.floor(newTime/(1000*60*60))*60)) + "分"}</span></div>
                  : <span className='task-item-time'>期限を設定していません</span>}
                <br />
                </div>
                {task.done ? '完了' : '未完了'}
              </Link>
            </li>
          )})}
      </ul>
    );
  }

  return (
    <ul>
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => {
          const newTime = new Date(task.limit) - new Date()
          return(
          <li key={key} className="task-item">
            <Link
              to={`/lists/${selectListId}/tasks/${task.id}`}
              className="task-item-link"
            >
              <div className='task-item-information'>
                <span className='task-item-title'>{task.title}</span>
                  {task.limit ?
                    <div className='task-item-div'><span className='task-item-time'>{"期限:"+ dayjs(new Date(task.limit)).format('YYYY年MM月DD日HH時mm分:')}</span>
                    <span className='task-item-time'>{'残り時間:'+ Math.floor(newTime/(1000 * 60 * 60 * 24))+"日" + (Math.floor(newTime/(1000 * 60 * 60)) - Math.floor(newTime/(1000 * 60 * 60 * 24)) * 24) + "時間" + (Math.floor(newTime/(1000*60)) - (Math.floor(newTime/(1000*60*60))*60)) + "分"}</span></div>
                  : <span className='task-item-time'>期限を設定していません</span>}
              <br />
              </div>
              {task.done ? '完了' : '未完了'}
            </Link>
          </li>
        )})}
    </ul>
  );
};
