import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// User Pages
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Theatres from "./pages/Theaters";
import NewReleases from "./pages/NewReleases";
import Booking from "./pages/Bookings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";

// Admin Pages
import AdminDashboard from "./adminpages/AdminDashboard";
import ViewBookings from "./adminpages/ViewBookings";
import AdminHeroSection from "./adminpages/AdminHeroSection";
import AdminMovies from "./adminpages/AdminMovies";
import AdminSidebar from "./components/AdminSidebar"; 
import SeatsPage from "./adminpages/AddSeats";
import CinemasPage from "./adminpages/AddCinema";


export default function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route
        path="/*"
        element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/theatres" element={<Theatres />} />
              <Route path="/new-releases" element={<NewReleases />} />
              <Route path="/booking/:showId" element={<Booking />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
           
            </Routes>
          </>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <div className="flex min-h-screen bg-white">
            <AdminSidebar />
            <div className="flex-1 p-6 bg-gray-50">
              <Routes>
                <Route path="" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="view-bookings" element={<ViewBookings />} />
                <Route path="hero-section" element={<AdminHeroSection />} />
                <Route path="movies" element={<AdminMovies />} />
                <Route path="seats" element={<SeatsPage/>} />
                <Route path="cinemas" element={<CinemasPage/>} />
              </Routes>
            </div>
          </div>
        }
      />
    </Routes>
  );
}