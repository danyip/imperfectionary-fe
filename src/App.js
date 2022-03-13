import DrawingCanvas from './components/DrawingCanvas';
import GuessingCanvas from './components/GuessingCanvas'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';

function App() {

  return (
    <div className="App">
      <header>
        <h1>imperfectionary</h1>
      </header>
      <Router>
        <Routes>
          <Route exact path='/draw' element={<DrawingCanvas/>}/>
          <Route exact path='/guess' element={<GuessingCanvas/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
