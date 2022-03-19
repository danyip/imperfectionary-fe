import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Nav from './components/Nav'
import io from "socket.io-client";

import { BASE_URL } from "./lib/api";

import "./App.css";

function App() {
  const token = useSelector((state) => state.token);
  const socket = useSelector((state) => state.socket);
  const navigate = useNavigate()

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
      <header>
        <h1 className="main-logo" onClick={() => navigate("/")}>
          imperfectionary
        </h1>
        <Nav />
      </header>

      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
