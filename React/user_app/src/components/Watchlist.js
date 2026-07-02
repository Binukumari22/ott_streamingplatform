import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./Watchlist.css";

function Watchlist() {

  const [movies, setMovies] = useState([]);
  const token = localStorage.getItem("token");

  //  Fetch watchlist
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/watchlist/", {
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => {
      setMovies(res.data);
    })
    .catch(err => console.log(err));
  }, [token]);

  //  Remove from watchlist
  const removeFromWatchlist = (movieId) => {
    axios.delete("http://127.0.0.1:8000/api/watchlist/remove/", {
      data: { movie_id: movieId },
      headers: {
        Authorization: `Token ${token}`
      }
    })
    .then(res => {
      alert(res.data.message);

      // update UI after delete
      setMovies(prev =>
        prev.filter(item => item.movie.id !== movieId)
      );
    })
    .catch(err => console.log(err));
  };

  return (
    <>
      <Navbar />

      <div className="watchlist-page">
        <h2 className="watchlist-title">My Watchlist</h2>

        <div className="watchlist-grid">

          {movies.length === 0 ? (
            <p>No movies in watchlist</p>
          ) : (
            movies.map(item => (
              <div className="movie-card" key={item.id}>

                <img
                  src={`http://127.0.0.1:8000${item.movie.thumbnail}`}
                  alt={item.movie.title}
                />

                <p>{item.movie.title}</p>

                <button
                  className="remove-btn"
                  onClick={() => removeFromWatchlist(item.movie.id)}
                >
                  Remove
                </button>

              </div>
            ))
          )}

        </div>
      </div>
    </>
  );
}

export default Watchlist;