
import {Login, SignUp, SignUpAsMentee, SignUpAsMentor} from './components/userAuthentication.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './components/home.jsx';
import Mentoring from './components/mentoring.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/mentoring' element={<Mentoring/>}/>
        <Route path='/register' element={<SignUp />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/signupasmenteor' element={<SignUpAsMentor/>}/>
        <Route path='/signupasmentee' element={<SignUpAsMentee/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
