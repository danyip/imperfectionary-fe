import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Nav from './components/Nav'
import io from "socket.io-client";

import { BASE_URL } from "./lib/api";
import "./App.css";

function App() {
  // Grab the token and socket from redux store
  const token = useSelector((state) => state.token);
  const socket = useSelector((state) => state.socket);
  
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    
    // If there is a token but no socket connection
    if (token && !socket) {

      // Make the socket connection and save it into redux store
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
