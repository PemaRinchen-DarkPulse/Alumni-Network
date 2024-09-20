
import {Login, SignUp, SignUpAsMentee, SignUpAsMentor} from './components/userAuthentication.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomeUi from './userViews/home.jsx';
import DirectoryUi from './userViews/directory.jsx'
import MentoringUi from './userViews/mentoring.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeUi />} />
        <Route path='/mentoring' element={<MentoringUi/>}/>
        <Route path='/register' element={<SignUp />}/>
        <Route path='/login' element={<Login />} />
        <Route path='/signupasmenteor' element={<SignUpAsMentor/>}/>
        <Route path='/signupasmentee' element={<SignUpAsMentee/>}/>
        <Route path='/directory' element={<DirectoryUi/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
