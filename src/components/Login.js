import React, { useState } from "react";
import "../stylesheets/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [emailFormatValidation, setEmailFormatValidation] = useState(true);
  const [password, setPassword] = useState("");

  const checkEmailFormat = (e) => {
    const emailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    if (emailRegex.test(e.target.value)) {
      setEmailFormatValidation(true);
      return;
    }
    setEmailFormatValidation(false);
  };

  const handleLogin = (e) => {
    e.preventDefault()
    console.log("TRIGGER LOGIN POST HERE");
    console.log(email, password);
  };

  return (
    <div>
      <h1>Login Component</h1>
      
      <div className="error-message"></div>
      <form 
        className="login-form-container"
        onSubmit={handleLogin}
      >
        <input
          className={`form-input ${!emailFormatValidation && "error-field"}`}
          id="email-input"
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          onBlur={checkEmailFormat}
        />
        <input
          id="password-input"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
