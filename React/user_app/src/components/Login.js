import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Login() {

  const navigate = useNavigate();   // used for redirect

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function attemptLogin(event) {

    event.preventDefault();   // stop page reload

    axios.post("http://127.0.0.1:8000/api/login/", {
      email: email,
      password: password
    })

    .then(response => {

      setErrorMessage("");

      // store token
      localStorage.setItem("token", response.data.token);

      // show success message
      setSuccessMessage("Login successful!");

      console.log("Token stored:", response.data.token);

      // redirect after 1 second
      setTimeout(() => {
        navigate("/home");
      }, 1000);

    })

    .catch(error => {

      setSuccessMessage("");

      if (error.response && error.response.data.errors) {

        setErrorMessage(
          Object.values(error.response.data.errors).join(" ")
        );

      }
      else if (error.response && error.response.data.message) {

        setErrorMessage(error.response.data.message);

      }
      else {

        setErrorMessage(
          "Login failed. Please check your credentials."
        );

      }

    });

  }

  return (
    <div className="signup-container">

      <form className="signup-form" onSubmit={attemptLogin}>

        <h2>Login</h2>
        <p className="subtitle">Welcome back</p>

        {/* Error message */}
        {errorMessage && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {errorMessage}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div style={{ color: "lightgreen", marginBottom: "10px" }}>
            {successMessage}
          </div>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </p>

      </form>

    </div>
  );
}

export default Login; 