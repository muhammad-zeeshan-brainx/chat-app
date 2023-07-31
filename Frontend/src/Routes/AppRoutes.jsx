import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import JoinChat from '../views/JoinChat/JoinChat';
import Home from '../views/Home/Home';
import { useState } from 'react';

function AppRoutes({ setShouldSocketConnect, userToken }) {
  console.log(
    'session storage----->>>>>>>',
    sessionStorage.getItem('userToken')
  );
  return userToken ? (
    <Routes>
      <Route
        path='/chats'
        element={<Home setShouldSocketConnect={setShouldSocketConnect} />}
      />
    </Routes>
  ) : (
    <Routes>
      <Route
        path='/'
        element={<JoinChat setShouldSocketConnect={setShouldSocketConnect} />}
      />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
}

export default AppRoutes;
