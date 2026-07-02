import React, { useEffect, useState } from "react";

import axios from "axios";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import Navbar from "./Navbar";

import "./SearchResults.css";

function SearchResults() {

  const [movies, setMovies] = useState([]);

  const location = useLocation();

  const navigate = useNavigate();

  // GET SEARCH QUERY
  const query = new URLSearchParams(
    location.search
  ).get("q");

  // FETCH SEARCH RESULTS
  useEffect(() => {

    if (!query) return;

    axios
      .get(
        `http://127.0.0.1:8000/api/search/?q=${query}`
      )

      .then((res) => {

        setMovies(res.data);

      })

      .catch((err) => {

        console.log(err);

      });

  }, [query]);

  return (

    <>
      <Navbar />

      <div className="search-page">

        <h2 className="search-title">

          Search Results for "{query}"

        </h2>

        <div className="search-grid">

          {movies.length > 0 ? (

            movies.map((movie) => (

              <div
                className="search-movie-card"

                key={movie.id}

                onClick={() =>
                  navigate(`/watch/${movie.id}`)
                }
              >

                <img
                  src={`http://127.0.0.1:8000${movie.thumbnail}`}
                  alt={movie.title}
                />

                <h3>{movie.title}</h3>

                <p>{movie.genre}</p>

              </div>

            ))

          ) : (

            <h3>No movies found</h3>

          )}

        </div>

      </div>

    </>

  );
}

export default SearchResults;