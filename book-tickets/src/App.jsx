import { Routes, Route } from "react-router-dom";
import "./index.css";
import Theatres from "./pages/Theaters";
import NewReleases from "./pages/NewReleases";
import Booking from "./pages/Bookings";
import MovieDetail from "./pages/MovieDetail";
import Movies from "./pages/Movies";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/new-releases" element={<NewReleases />} />
        <Route path="/booking/:movieId" element={<Booking />} />
      </Routes>
    </>
  );
}
