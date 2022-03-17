import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";
import DrawingCanvas from "./components/DrawingCanvas";
import GuessingCanvas from "./components/GuessingCanvas";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function App() {
  console.log(' %c App rendering', 'font-size: 16px');

  const token = localStorage.getItem('jwt')

  const dispatch = useDispatch();

  useEffect(() => {

    if (token) {
      
      dispatch({
        type: "socketIO/connect",
        payload: io.connect("http://localhost:9090", {
          auth: {
            token: token,
          },
        }),
      });
    }
    
  }, [])
  

  


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/lobby" element={<Lobby />} />
            <Route exact path="/play" element={<GameRoom />} />
            <Route exact path="/draw" element={<DrawingCanvas />} />
            <Route exact path="/guess" element={<GuessingCanvas />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
