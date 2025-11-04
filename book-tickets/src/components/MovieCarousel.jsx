import { useState } from "react"
import { Link } from "react-router-dom"

const MovieCarousel = ({ title, movies }) => {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = (direction) => {
    const container = document.getElementById(`carousel-${title}`)
    if (container) {
      const scrollAmount = 300
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
        setScrollPosition(scrollPosition - scrollAmount)
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
        setScrollPosition(scrollPosition + scrollAmount)
      }
    }
  }

  return (
    <div className="py-8 px-4">
      {/* Header with title and "View All" link */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <a href="#" className="text-red-500 hover:text-red-400 transition font-medium">
          View All →
        </a>
      </div>

      {/* Carousel container */}
      <div className="relative group">
        {/* Left scroll button */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center transition hidden group-hover:flex"
        >
          ❮
        </button>

        {/* Movie cards */}
        <div id={`carousel-${title}`} className="flex gap-4 overflow-x-auto scroll-smooth pb-4 hide-scrollbar">
          {movies.map((movie) => (
            <Link to={`/movie/${movie.id}`} key={movie.id} className="flex-shrink-0 w-48 group/card cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3 h-64 bg-gray-800">
                <img
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition"
                />
              </div>
              <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
              <p className="text-gray-400 text-xs mb-2">{movie.year}</p>
              <div className="flex justify-between text-xs mb-3">
                <span className="text-gray-400">{movie.genre}</span>
                <span className="text-yellow-400">⭐ {movie.rating}</span>
              </div>
              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-medium text-sm transition">
                Book Ticket
              </button>
            </Link>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-80 text-white w-10 h-10 rounded-full flex items-center justify-center transition hidden group-hover:flex"
        >
          ❯
        </button>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default MovieCarousel
