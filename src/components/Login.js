import React, { useState } from "react";
import { emailRegex} from "../utils/regex";
import "../stylesheets/forms.css";

function Login() {
  const [email, setEmail] = useState("");
  const [emailFormatValidation, setEmailFormatValidation] = useState(true);
  const [password, setPassword] = useState("");

  const checkEmailFormat = () => {
    setEmailFormatValidation(emailRegex.test(email));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("TRIGGER LOGIN POST HERE");
    console.log(email, password);
  };

  return (
    <div>
      <h1>Login Component</h1>
      <div className="error-message"></div>
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
