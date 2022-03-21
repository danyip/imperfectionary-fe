import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from "./redux/store";

import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import EditProfile from "./components/EditProfile";
import Lobby from "./components/Lobby";
import GameRoom from "./components/GameRoom";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
            <Route path="" element={<App />}>
            <Route exact path="" element={<Home />} />
            <Route exact path="login" element={<Login />} />
            <Route exact path="signup" element={<SignUp />} />
            <Route exact path="profile" element={<EditProfile />} />
            <Route exact path="lobby" element={<Lobby />} />
            <Route exact path="play" element={<GameRoom />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

