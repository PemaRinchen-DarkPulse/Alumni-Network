
import Footer from './components/footer.jsx';
import Header from './components/header.jsx';
import {MyCard,MySecondCard} from './components/mycard.jsx';
import {GetInvolved,About} from './components/getinvolved.jsx';
import {Login, SignUp} from './components/userAuthentication.jsx';
import MyHero from './components/hero.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/register' element={<SignUp/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
    </Routes>
    </BrowserRouter>
  );
}
export default App;
