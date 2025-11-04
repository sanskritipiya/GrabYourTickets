import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import { newReleases } from "../assets/assets";


const NewReleases = () => {
  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-2">New Releases</h1>
        <p className="text-gray-400 mb-8">Upcoming movies coming soon</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newReleases.map((movie) => (
            <MovieCard key={movie.id} movie={movie} upcoming />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewReleases;
