import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import io from "socket.io-client";

import { login } from "../lib/api";
import { emailRegex } from "../lib/regex";
import { BASE_URL } from "../lib/api";

import "../stylesheets/forms.css";

function Login() {
  const [email, setEmail] = useState("");
  const [emailFormatValidation, setEmailFormatValidation] = useState(true);
  const [password, setPassword] = useState("");
  const [serverErrorMessage, setServerErrorMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkEmailFormat = () => {
    setEmailFormatValidation(emailRegex.test(email));
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await login(email, password);

      // Make the socket connection passing the token from login
      const socket = io.connect(BASE_URL, {
      auth: {
          token: res.data.token,
        },
      });

      // Pass userName, token and socket connection to redux
      dispatch({ type: "currentUser/login", payload: [res.data, socket] });

      // To the lobby!
      navigate("/lobby");

    } catch (err) {
      console.log(err);
      if (err.response.data.message) {
        setServerErrorMessage(err.response.data.message)
      }
    }
  };

  return (
    <div className="form-wrapper">
      <h1>Login Component</h1>
      <div className="error-message">{serverErrorMessage}</div>
      <form className="form-container" onSubmit={handleLogin}>
        <label>
          Email:
          <input
            className={`form-input ${!emailFormatValidation && "error-field"}`}
            id="email-input"
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checkEmailFormat}
          />
        </label>
        <label>
          Password:
          <input
            id="password-input"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
