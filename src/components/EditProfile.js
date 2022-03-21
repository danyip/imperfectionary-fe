import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "../stylesheets/forms.css";
import { emailRegex, usernameRegex } from "../lib/regex";
import { update } from "../lib/api";

function EditProfile() {
  const currentUser = useSelector((state) => state.currentUser);
  const token = useSelector((state) => state.token);
  const socket = useSelector((state) => state.socket);

  const [errorMessages, setErrorMessages] = useState({});
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [usernameFormatValidation, setUsernameFormatValidation] = useState(true);
  const [emailFormatValidation, setEmailFormatValidation] = useState(true);
  const [passwordMatchValidation, setPasswordMatchValidation] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const checkEmailFormat = () => {
    setEmailFormatValidation(emailRegex.test(email));
  };

  const checkUsernameFormat = () => {
    setUsernameFormatValidation(usernameRegex.test(username));
  };

  const checkPasswordsMatch = () => {
    setPasswordMatchValidation(password === passwordConfirm);
  };

  const runErrorCheck = () => {
    const errors = {};

    if (!emailRegex.test(email)) {
      errors.email = "Invaild email address";
    }
    if (!usernameRegex.test(username)) {
      errors.username = "Invaild username";
    }
    if (password !== passwordConfirm) {
      errors.password = "Passwords do not match";
    }

    setErrorMessages(errors);

    return Object.keys(errors).length === 0;
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();

    if (runErrorCheck()) {
      try {
        // Send data to server
        const res = await update(username, email, password, token);

        // Pass userName, token and socket connection to redux
        dispatch({
          type: "currentUser/login",
          payload: [{ user: res.data, token: token }, socket],
        });

        // To the lobby!
        navigate("/lobby");
      } catch (err) {
        
        // Catch the error of an attempted duplicated username or email
        if (err.response.data.code === 11000) {
          setServerErrorMessage(
            `${Object.values(err.response.data.keyValue)[0]} already exists`
          );
        }
      }
    }
  };

  return (
    <div className="form-wrapper">
      <h1>{username}'s profile</h1>

      <div className="error-message">{serverErrorMessage}</div>

      <form className="form-container" onSubmit={handleEditProfile}>
        <label>
          Username:
          <input
            className={`form-input ${
              !usernameFormatValidation && "error-field"
            }`}
            id="name-input"
            type="text"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            onBlur={checkUsernameFormat}
          />
          <div className="error-message">{errorMessages.username}</div>
        </label>
        <label>
          Email:
          <input
            className={`form-input ${!emailFormatValidation && "error-field"}`}
            id="email-input"
            type="email"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checkEmailFormat}
          />
          <div className="error-message">{errorMessages.email}</div>
        </label>
        <label>
          New Password:
          <input
            className={`form-input ${
              !passwordMatchValidation && "error-field"
            }`}
            id="password-input"
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="error-message">{errorMessages.password}</div>
        </label>
        <label>
          Confirm New Password:
          <input
            className={`form-input ${
              !passwordMatchValidation && "error-field"
            }`}
            id="confirm-password-input"
            type="password"
            value={passwordConfirm}
            placeholder="confirm password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onBlur={checkPasswordsMatch}
          />
          <div className="error-message">{errorMessages.password}</div>
        </label>
        <button>Update</button>
      </form>
    </div>
  );
}

export default EditProfile;
