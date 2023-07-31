import { Fragment } from 'react';
import { useState } from 'react';
import './JoinForm.css';
import { useNavigate } from 'react-router-dom';

import socket from '../services/socket';

function JoinForm({ setShouldSocketConnect }) {
  const [username, setUserName] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      console.log('username is:', username);
      socket.auth = { username };
      setShouldSocketConnect(true);
      socket.on('connect', () => {
        console.log('Connected to the server.');
        sessionStorage.setItem('userToken', username);
        navigate('/chats');
      });
      socket.on('connect_error', (err) => {
        if (err.message === 'invalid username') {
          alert('could not connect to server, please try again/later');
        }
      });
    }
  };
  return (
    <Fragment>
      <div className='join-form-container'>
        <div>Join Form</div>
        <form onSubmit={(e) => handleSubmit(e)} className='join-form'>
          <input type='text' onChange={(e) => setUserName(e.target.value)} />
          <button type='submit'>Submit</button>
        </form>
      </div>
    </Fragment>
  );
}

export default JoinForm;
