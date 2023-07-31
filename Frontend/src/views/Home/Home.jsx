import { Fragment } from 'react';
import JoinChat from '../JoinChat/JoinChat';
import './Home.css';
import socket from '../../services/socket';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ setShouldSocketConnect }) {
  const navigate = useNavigate();
  console.log('home component');
  const [connectedUsers, setConnectedUsers] = useState(new Map());
  useEffect(() => {
    // Add event listener for the "users" event
    socket.emit('users');

    socket.on('users', (users) => {
      console.log('users event', users);
      setConnectedUsers(new Map(users));
    });

    socket.on('newUsers', (user) => {
      addUser(user);
    });

    socket.on('userDisconnected', (user) => {
      console.log('userdisconnected event occur', user);
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
  const genrateUniqueId = () => {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
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
      <div className='topbar'>
        <h1 className='title'>Chat APP</h1>
        <div className='logout'>
          <button onClick={handleLeave}>Leave</button>
        </div>
      </div>
      <div className='home-container'>
        <h1>Chatss</h1>
        {connectedUsers?.size &&
          Array.from(connectedUsers.values()).map((user) => (
            <div key={user?.id}>{user.username}</div>
          ))}
      </div>
    </Fragment>
  );
}

export default Home;
