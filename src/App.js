
import Footer from './components/footer.jsx';
import Header from './components/header.jsx';
import {MyCard,MySecondCard} from './components/mycard.jsx';
import {GetInvolved,About} from './components/getinvolved.jsx'
import MyHero from './components/hero.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'

function App() {
  return (
    <> 
    <Header/>
    <MyHero/>
    <About/>
    <MyCard/><br/>
    <MySecondCard/>
    <GetInvolved/>
    <Footer/>
    </>
  );
}
export default App;
