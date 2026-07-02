import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "./Navbar";

function Home() {

  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [genres, setGenres] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // fetch featured movies
    axios.get("http://127.0.0.1:8000/api/featured-movies/")
      .then(res => setFeatured(res.data));

    // fetch movies by genre
    axios.get("http://127.0.0.1:8000/api/movies-by-genre/")
      .then(res => setGenres(res.data));

  }, [navigate]);


  // auto slide featured carousel
  useEffect(() => {

    if (featured.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featured.length);
    }, 3000);

    return () => clearInterval(interval);

  }, [featured]);


  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };


  return (
    <div>
      <Navbar />
    <div className="home">
      <h2>Trending Now</h2>

{/* HERO CAROUSEL */}

{featured.length > 0 && (

<div className="hero-carousel">

<button className="arrow left" onClick={prevSlide}>❮</button>

<div className="carousel">

{featured.map((movie, index) => {

let position = index - currentIndex;

if (position < -3) position += featured.length;
if (position > 3) position -= featured.length;

return (

<div
key={movie.id}
className={`hero-card pos${position}`}
onClick={() => navigate(`/watch/${movie.id}`)}
>

<img
src={`http://127.0.0.1:8000${movie.thumbnail}`}
alt={movie.title}
/>

<h3>{movie.title}</h3>

</div>

);

})}

</div>

<button className="arrow right" onClick={nextSlide}>❯</button>

</div>

)}


{/* GENRE SECTIONS */}

{Object.keys(genres).map((genre) => (

<div key={genre} className="genre-section">

<h2>{genre}</h2>

<div className="movie-row">

{genres[genre].map(movie => (

<div
key={movie.id}
className="movie-card"
onClick={() => navigate(`/watch/${movie.id}`)}
>

<img
src={`http://127.0.0.1:8000${movie.thumbnail}`}
alt={movie.title}
/>

</div>

))}

</div>

</div>

))}

    </div>
    </div>
  );
}


export default Home;