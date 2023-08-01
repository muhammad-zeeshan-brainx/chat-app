import { Fragment, useState } from 'react';
import './App.css';
import JoinChat from './views/JoinChat/JoinChat';
import Rou from './views/Home/Home';
import AppRoutes from './Routes/AppRoutes';
import { useEffect } from 'react';
import socket from './services/socket';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home';
import { Navigate } from 'react-router-dom';

function App() {
  const [shouldSocketCOnnect, setShouldSocketConnect] = useState(false);
  const [userToken, setUserToken] = useState(
    sessionStorage.getItem('userToken') || ''
  );
  useEffect(() => {
    console.log('App comp');

    if (shouldSocketCOnnect || userToken) {
      if (!socket.connected) {
        console.log('socket connection started....');
        if (userToken) {
          socket.auth = { username: userToken };
        }
        socket.connect(); // Establish the socket connection once when the app starts
      }
    }

    return () => {
      if (socket.connected) {
        console.log('disconnecting');
        socket.disconnect(); // Clean up the socket connection when the app unmounts (optional)
      }
    };
  }, [shouldSocketCOnnect]);
  return (
    <Fragment>
      <Routes>
        <Route
          path='/chats'
          element={<Home setShouldSocketConnect={setShouldSocketConnect} />}
        />
        <Route
          path='/'
          element={<JoinChat setShouldSocketConnect={setShouldSocketConnect} />}
        />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Fragment>
  );
}

export default App;
