import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./Watchlist.css";

function WatchHistory() {

  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {

    axios.get("http://127.0.0.1:8000/api/watchhistory/view/", {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then((res) => {
      setHistory(res.data);
    })
    .catch((err) => {
      console.log(err);
    });

  }, [token]);

  // ✅ REMOVE DUPLICATES
  const uniqueHistory = history.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.movie.id === item.movie.id)
  );

  return (
    <>
      <Navbar />

      <div className="watchlist-page">
        <h2 className="watchlist-title">Watch History</h2>

        <div className="watchlist-grid">

          {uniqueHistory.length === 0 ? (
            <p>No watch history</p>
          ) : (
            uniqueHistory.map((item) => (
              <div className="movie-card" key={item.id}>
                <img
                  src={`http://127.0.0.1:8000${item.movie.thumbnail}`}
                  alt={item.movie.title}
                />
                <p>{item.movie.title}</p>
              </div>
            ))
          )}

        </div>
      </div>
    </>
  );
}

export default WatchHistory;