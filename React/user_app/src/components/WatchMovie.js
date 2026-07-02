import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./WatchMovie.css";
import Navbar from "./Navbar";

function WatchMovie() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);

  useEffect(() => {

    axios.get(
      `http://127.0.0.1:8000/api/movies/${id}/`
    )
    .then((res) => {

      setMovie(res.data);

    })
    .catch((err) => {

      console.log(err);

    });

  }, [id]);

  //  Save watch history + navigate
  const watchMovie = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:8000/api/watchhistory/add/",
        {
          movie_id: id
        },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      navigate(`/player/${id}`);

    } catch (err) {

      console.log(err);

      navigate(`/player/${id}`);

    }

  };

  //  Add to watchlist
  const addToWatchlist = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://127.0.0.1:8000/api/watchlist/add/",
        {
          movie_id: id
        },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );

      alert(res.data.message);

    } catch (err) {

      console.log(err);

      alert("Error adding movie");

    }

  };

  if (!movie) {
    return <h2>Loading...</h2>;
  }

  return (

    <div>

      <Navbar />

      <div
        className="watch-page"
        style={{
          backgroundImage:
            `url(http://127.0.0.1:8000${movie.thumbnail})`
        }}
      >

        <div className="watch-overlay">

          <div className="watch-content">

            <h1>{movie.title}</h1>

            <p>{movie.genre}</p>

            <p>{movie.description}</p>

            <div className="watch-buttons">

              {/* WATCH BUTTON */}
              <button
                className="watch-btn"
                onClick={watchMovie}
              >
                ▶ Watch Now
              </button>

              {/* WATCHLIST BUTTON */}
              <button
                className="watchlist-btn"
                onClick={addToWatchlist}
              >
                ➕
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default WatchMovie;