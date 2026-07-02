import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {

  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

 
  const logout = () => {

    const token = localStorage.getItem("token");

    if (token) {

      axios.post(
        "http://127.0.0.1:8000/api/logout/",
        {},
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )

      .then(() => {

        // REMOVE TOKEN
        localStorage.removeItem("token");

        // REDIRECT LOGIN
        navigate("/login");

      })

      .catch((err) => {

        console.log(err);

        // EVEN IF API FAILS
        localStorage.removeItem("token");

        navigate("/login");

      });

    }

  };

  return (

    <div className="navbar">

      {/* LEFT */}
      <div className="navbar-left">

        <h3>OTT Platform</h3>

      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        <span onClick={() => navigate("/home")}>
          Home
        </span>

        <span onClick={() => navigate("/watchlist")}>
          Watchlist
        </span>

        <span onClick={() => navigate("/history")}>
          History
        </span>

        {/* SEARCH */}
        <div className="navbar-search">

          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}

            onChange={(e) =>
              setSearchTerm(e.target.value)
            }

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                if (searchTerm.trim() !== "") {

                  navigate(
                    `/search?q=${searchTerm}`
                  );

                }

              }

            }}
          />

          <button

            onClick={() => {

              if (searchTerm.trim() !== "") {

                navigate(
                  `/search?q=${searchTerm}`
                );

              }

            }}

          >
            🔍
          </button>

        </div>

        {/* USER */}
        <div className="user-wrapper">

          <div
            className="user-icon"
            onClick={() => setOpen(!open)}
          >
            👤
          </div>

          {open && (

            <div className="user-dropdown">

              <div
  className="dropdown-item"

  onClick={() =>
    navigate("/change-password")
  }
>
  Change Password
</div>

              <div className="dropdown-divider"></div>

              <div
                className="dropdown-item logout"

                onClick={logout}
              >
                Logout
              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );
};

export default Navbar;