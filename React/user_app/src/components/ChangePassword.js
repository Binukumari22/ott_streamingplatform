import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./ChangePassword.css";

function ChangePassword() {

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = () => {

    axios.post(

      "http://127.0.0.1:8000/api/change_password/",

      {
        old_password: oldPassword,
        new_password: newPassword
      },

      {
        headers: {
          Authorization: `Token ${token}`
        }
      }

    )

    .then((res) => {

      alert(res.data.message);

      navigate("/home");

    })

    .catch((err) => {

      console.log(err);

      alert("Password change failed");

    });

  };

  return (

    <>
      <Navbar />

      <div className="change-password-container">

        <div className="change-password-form">

          <h2>Change Password</h2>

          <input
            type="password"
            placeholder="Old Password"

            value={oldPassword}

            onChange={(e) =>
              setOldPassword(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="New Password"

            value={newPassword}

            onChange={(e) =>
              setNewPassword(e.target.value)
            }
          />

          <button onClick={handleSubmit}>
            Change Password
          </button>

        </div>

      </div>
    </>

  );
}

export default ChangePassword;