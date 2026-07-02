import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./MovieList.css";
import Navbar from "./Navbar";  



function MovieList() {

  const { genre } = useParams();
  const [movies, setMovies] = useState([]);

  useEffect(() => {

    axios
      .get(`http://127.0.0.1:8000/api/movies/${genre}/`)
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.log("Error fetching movies:", error);
      });

  }, [genre]);

  return (
    <>
      <Navbar />

   
    <div className="movies-page">

      <h1 className="movies-title">{genre} Movies</h1>

      <div className="movies-grid">

        {movies.map((movie) => (

          <div className="movie-card" key={movie.id}>

            <img
              src={`http://127.0.0.1:8000/${movie.thumbnail}`}
              alt={movie.title}
            />

            <p>{movie.title}</p>

          </div>

        ))}

      </div>

    </div>
    </>
    
  );
}

export default MovieList;