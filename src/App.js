
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; //importing css
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomeUi from './userViews/homeUi.jsx';
import DirectoryUi from './userViews/directoryUi.jsx';
import MentoringUi from './userViews/mentoringUi.jsx'
import EventsUi from './userViews/eventsUi.jsx';
import NewsUi from './userViews/newsUi.jsx';
import ContactUi from './userViews/contactUi.jsx';
import AboutUsUi from './userViews/aboutUsUi.jsx';
import {Login,SignUp } from './components/login/userAuthentication.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeUi/>} />
        <Route path='/directory' element={<DirectoryUi/>}/>
        <Route path='/events' element={<EventsUi/>}/>
        <Route path='/mentoring' element={<MentoringUi/>}/>
        <Route path='/news' element={<NewsUi/>}/>
        <Route path='/contact' element={<ContactUi/>}/>
        <Route path='/aboutus' element={<AboutUsUi/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
