import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./MoviePlayer.css";

function MoviePlayer() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/movies/${id}/`)
      .then(res => setMovie(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!movie) return <h2 style={{color:"white"}}>Loading...</h2>;

  return (
    <div className="player-container">

      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* 🎬 Video Player */}
      <video
        className="video-player"
        controls
        autoPlay
      >
        <source
          src={`http://127.0.0.1:8000${movie.video}`}
          type="video/mp4"
        />
      </video>

      

    </div>
  );
}

export default MoviePlayer;