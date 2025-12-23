import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import axios from "axios";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/movies");

        // ✅ always use MongoDB _id
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

  if (loading) {
    return (
      <p className="text-white text-center mt-12">
        Loading movies...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center mt-12">
        {error}
      </p>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          All Movies
        </h1>
        <p className="text-gray-400 mb-8">
          Browse our complete collection
        </p>

        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <p className="text-white">
            No movies available
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Movies;
