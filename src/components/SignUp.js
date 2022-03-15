import React, { useState } from "react";
import "../stylesheets/forms.css";
import { emailRegex, usernameRegex } from "../utils/regex";

function SignUp() {
  const [errorMessages, setErrorMessages] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [usernameFormatValidation, setUsernameFormatValidation] = useState(true);
  const [emailFormatValidation, setEmailFormatValidation] = useState(true);
  const [passwordMatchValidation, setPasswordMatchValidation] = useState(true);

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

  const handleSignUp = (e) => {
    e.preventDefault();

    if (runErrorCheck()) {
      console.log("TRIGGER SignUp POST HERE");
      console.log(username, email, password);
    }
  };

  return (
    <div>
      <h1>SignUp Component</h1>

      <form className="form-container" onSubmit={handleSignUp}>
        <label>
          Username:
          <input
            className={`form-input ${
              !usernameFormatValidation && "error-field"
            }`}
            id="name-input"
            type="text"
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
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checkEmailFormat}
          />
          <div className="error-message">{errorMessages.email}</div>
        </label>
        <label>
          Password:
          <input
            className={`form-input ${
              !passwordMatchValidation && "error-field"
            }`}
            id="password-input"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="error-message">{errorMessages.password}</div>
        </label>
        <label>
          Confirm Password:
          <input
            className={`form-input ${
              !passwordMatchValidation && "error-field"
            }`}
            id="confirm-password-input"
            type="password"
            placeholder="confirm password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onBlur={checkPasswordsMatch}
          />
          <div className="error-message">{errorMessages.password}</div>
        </label>
        <button>SignUp</button>
      </form>
    </div>
  );
}

export default SignUp;
