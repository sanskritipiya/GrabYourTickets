import { useState, useEffect, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import axios from "axios";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 Search & Filter State
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/movies");
        setMovies(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // ✅ FILTER LOGIC
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const searchMatch =
        movie.title?.toLowerCase().includes(search.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(search.toLowerCase());

      const locationMatch =
        location === "All" ||
        movie.location === location ||
        movie.locations?.includes(location);

      return searchMatch && locationMatch;
    });
  }, [movies, search, location]);

  if (loading) {
    return <p className="text-white text-center mt-12">Loading movies...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-12">{error}</p>;
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Discover Movies</h1>
        <p className="text-gray-400 mb-6">
          Search and filter movies by title, genre, or location
        </p>

        {/* 🔍 Search & Location Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="flex items-center w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3">
            <svg
              className="w-5 h-5 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-4.35-4.35" />
              <circle cx="11" cy="11" r="8" />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, genres..."
              className="bg-transparent outline-none text-white w-full placeholder-gray-400"
            />
          </div>

          {/* Location Dropdown */}
          <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 w-full md:w-64">
            <svg
              className="w-5 h-5 text-gray-400 mr-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-white outline-none w-full"
            >
              <option value="All" className="bg-gray-900">
                All Locations
              </option>
              <option value="Kathmandu" className="bg-gray-900">
                Kathmandu
              </option>
              <option value="Lalitpur" className="bg-gray-900">
                Lalitpur
              </option>
              <option value="Bhaktapur" className="bg-gray-900">
                Bhaktapur
              </option>
            </select>
          </div>
        </div>

        {/* Found Movies Count */}
        <p className="text-gray-400 mb-6">
          Found {filteredMovies.length} movies
        </p>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-white text-center mt-12">
            No movies match your search
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Movies;
