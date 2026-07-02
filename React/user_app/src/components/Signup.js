import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  function registerUser(e) {
    e.preventDefault();

    const user = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConf,
    };

    axios
      .post("http://127.0.0.1:8000/api/signup/", user)

      .then((response) => {

        setErrorMessage("");
        setSuccessMessage("Signup successful!");

        // redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })

      .catch((error) => {
        setSuccessMessage("");

        if (error.response && error.response.data.errors) {
          setErrorMessage(
            Object.values(error.response.data.errors).join(" ")
          );
        } else {
          setErrorMessage("Signup failed. Please try again.");
        }
      });
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={registerUser}>

        <h2>Create Account</h2>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <p style={{ color: "green" }}>{successMessage}</p>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <p style={{ color: "red" }}>{errorMessage}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConf}
          onChange={(e) => setPasswordConf(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </form>
    </div>
  );
}

export default Register;