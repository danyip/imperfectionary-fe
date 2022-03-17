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
import { useEffect, useState } from "react";

function App() {
  console.log(" %c App rendering", "font-size: 16px");

  const token = localStorage.getItem("jwt");

  const [socket, setSocket] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const socket = io.connect("http://localhost:9090", {
        auth: {
          token: token,
        },
      });

      setSocket(socket);
      // dispatch({
      //   type: "socketIO/connect",
      //   payload: io.connect("http://localhost:9090", {
      //     auth: {
      //       token: token,
      //     },
      //   }),
      // });
      return ()=> {socket.disconnect()}
    }
  }, []);
  

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/lobby" element={<Lobby socket={socket} />} />
            <Route exact path="/play" element={<GameRoom socket={socket}/>} />
            <Route exact path="/draw" element={<DrawingCanvas />} />
            <Route exact path="/guess" element={<GuessingCanvas />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
