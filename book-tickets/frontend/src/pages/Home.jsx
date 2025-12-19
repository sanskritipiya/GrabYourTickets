import { useState } from "react"
import HeroSection from "../components/HeroSection"
import Footer from "../components/Footer"
import MovieCard from "../components/MovieCard"
import { allMovies, trailers } from "../assets/assets"


export default function Home() {
  const onlyFourTrailers = trailers.slice(0, 4)
  const [activeTrailerId, setActiveTrailerId] = useState(onlyFourTrailers[0]?.id)
  const activeTrailer = onlyFourTrailers.find((t) => t.id === activeTrailerId) || onlyFourTrailers[0]
  return (
    <div className="bg-gray-950 min-h-screen">
      <HeroSection />
      <div className="max-w-7xl mx-auto">
        {/* Now Showing */}
        <section className="py-10 px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Now Showing</h2>
            <a href="/movies" className="text-red-500 hover:text-red-400 transition font-medium">View All →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {allMovies.slice(0, 10).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Trailers */}
        <section className="py-10 px-4">
          <h2 className="text-2xl font-bold text-white mb-6">Trailers</h2>
          <div className="mb-6 aspect-video w-full rounded-xl overflow-hidden bg-gray-800">
            {activeTrailer?.videoUrl ? (
              <iframe
                title={activeTrailer.title}
                src={activeTrailer.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : null}
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {onlyFourTrailers.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTrailerId(t.id)}
                className={`flex-shrink-0 rounded-lg overflow-hidden border ${
                  activeTrailerId === t.id ? "border-red-500" : "border-transparent"
                }`}
              >
                <img src={t.thumbnail} alt={t.title} className="h-44 w-28 md:h-56 md:w-36 object-cover" />
              </button>
            ))}
          </div>
          <style>{`
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
        </section>
      </div>
      <Footer />
    </div>
  )
}
