import DrawingCanvas from './components/DrawingCanvas';
import ImageDetection from './components/ImageDetection';
import './App.css';

function App() {
  return (
    <div className="App">
      HOME
      <div className='canvas-container'>
        <DrawingCanvas/>
      </div>
      <ImageDetection/>
    </div>
  );
}

export default App;
