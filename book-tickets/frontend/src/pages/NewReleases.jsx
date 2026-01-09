import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import axios from "axios";

const NewReleases = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:3000/api/movies/new-releases");
        
        console.log("New releases response:", res.data);
        const movies = res.data?.data || [];
        console.log(`Loaded ${movies.length} new release movies`);
        
        setMovies(movies);
      } catch (err) {
        console.error("Failed to fetch new releases:", err);
        setError(err.response?.data?.message || "Failed to load new releases");
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
          <p className="text-white text-center">Loading new releases...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
          <p className="text-red-500 text-center">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">New Releases</h1>
        <p className="text-gray-400 mb-8">Recently added movies</p>

        {movies.length === 0 ? (
          <p className="text-gray-400 text-center">No new releases available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewReleases;