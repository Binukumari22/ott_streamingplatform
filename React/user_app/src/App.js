import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import MovieList from "./components/MovieList";
import WatchMovie from "./components/WatchMovie";
import Watchlist from "./components/Watchlist";
import WatchHistory from "./components/WatchHistory";
import ChangePassword from "./components/ChangePassword";
import SearchResults from "./components/SearchResults";
import MoviePlayer from "./components/MoviePlayer";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies/:genre" element={<MovieList />} />
        <Route path="/watch/:id" element={<WatchMovie />} />
        <Route path="/player/:id" element={<MoviePlayer />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/history" element={<WatchHistory />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

