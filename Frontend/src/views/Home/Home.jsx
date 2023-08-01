import { Fragment } from 'react';
import JoinChat from '../JoinChat/JoinChat';
import './Home.css';
import socket from '../../services/socket';
import { useState } from 'react';
import { useEffect } from 'react';
import MessageItem from '../../components/Home/MessageItem';
import { useNavigate } from 'react-router-dom';

function Home({ setShouldSocketConnect }) {
  const navigate = useNavigate();
  const [connectedUsers, setConnectedUsers] = useState(new Map());
  useEffect(() => {
    // Add event listener for the "users" event
    socket.emit('users');

    socket.on('users', (users) => {
      setConnectedUsers(new Map(users));
    });

    socket.on('newUsers', (user) => {
      addUser(user);
    });

    socket.on('userDisconnected', (user) => {
      removeUser(user.id);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('users');
    };
  }, []);

  const handleLeave = () => {
    sessionStorage.removeItem('userToken');
    socket.disconnect();
    setShouldSocketConnect(false);
    navigate('/');
  };

  const addUser = (user) => {
    setConnectedUsers((prevConnectedUsers) =>
      new Map(prevConnectedUsers).set(user.id, user)
    );
  };

  const removeUser = (userId) => {
    setConnectedUsers((prevConnectedUsers) => {
      const updatedUsers = new Map(prevConnectedUsers);
      updatedUsers.delete(userId);
      return updatedUsers;
    });
  };

  return (
    <Fragment>
      <div className='main-container'>
        <div className='topbar'>
          <h1 className='title'>Chat APP</h1>
          <div className='logout'>
            <button onClick={handleLeave}>Leave</button>
          </div>
        </div>
        <div className='sidebar'>
          <div className='people'>People</div>
          <ul className='people-list'>
            {connectedUsers?.size &&
              Array.from(connectedUsers.values()).map((user) => (
                <li className='user-item' key={user?.id}>
                  {user.username}
                </li>
              ))}
          </ul>
        </div>
        <div className='content'>
          <div className='messages-container'>
            <MessageItem />
          </div>
          <form className='message-form'>
            <div className='message-input'>
              <input type='text' placeholder='Write Something'></input>
            </div>
            <div className='send-message-btn'>
              <button type='submit'>Send</button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
