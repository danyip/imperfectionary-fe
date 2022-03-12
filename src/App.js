import DrawingCanvas from './components/DrawingCanvas';
import ImageDetection from './components/ImageDetection';
import GuessingCanvas from './components/GuessingCanvas'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="App">
      HOME

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
