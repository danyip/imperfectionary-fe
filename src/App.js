import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import DrawingCanvas from './components/DrawingCanvas';
import GuessingCanvas from './components/GuessingCanvas'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';

function App() {

  

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}>
            <Route exact path='/login' element={<Login/>}/>
            <Route exact path='/signup' element={<SignUp/>}/>
            <Route exact path='/draw' element={<DrawingCanvas/>}/>
            <Route exact path='/guess' element={<GuessingCanvas/>}/>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
