import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeUi from './userViews/homeUi.jsx';
import DirectoryUi from './userViews/directoryUi.jsx'; // Keep the DirectoryUi import
import MentoringUi from './userViews/mentoringUi.jsx';
import EventsUi from './userViews/eventsUi.jsx';
import NewsUi from './userViews/newsUi.jsx';
import ContactUi from './userViews/contactUi.jsx';
import AboutUsUi from './userViews/aboutUsUi.jsx';
import { Login, SignUp } from './components/login/userAuthentication.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeUi isLoggedIn={isLoggedIn} />} />
        <Route path='/events' element={<EventsUi isLoggedIn={isLoggedIn} />} />
        <Route path='/news' element={<NewsUi isLoggedIn={isLoggedIn} />} />
        <Route path='/contact' element={<ContactUi isLoggedIn={isLoggedIn} />} />
        <Route path='/aboutus' element={<AboutUsUi isLoggedIn={isLoggedIn} />} />
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/directory/*' element={isLoggedIn ? <DirectoryUi isLoggedIn={isLoggedIn} /> : <Navigate to="/login" />} />
        <Route path='/mentoring' element={isLoggedIn ? <MentoringUi isLoggedIn={isLoggedIn} /> : <Navigate to="/login" />} />
        <Route path='/register' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
