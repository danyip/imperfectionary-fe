import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

import { BASE_URL } from "./lib/api";

import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import EditProfile from "./components/EditProfile";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";

import "./App.css";

function App() {

  const token = useSelector((state) => state.token);
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !socket) {
      dispatch({
        type: "socketIO/connect",
        payload: io.connect(BASE_URL, {
          auth: {
            token: token,
          },
        }),
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/profile" element={<EditProfile />} />
            <Route exact path="/lobby" element={<Lobby />} />
            <Route exact path="/play" element={<GameRoom />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
