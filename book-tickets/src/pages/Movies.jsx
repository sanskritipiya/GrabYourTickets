import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import { allMovies } from "../assets/assets";


const Movies = () => {
  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">All Movies</h1>
        <p className="text-gray-400 mb-8">Browse our complete collection</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
