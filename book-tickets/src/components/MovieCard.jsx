import { Link } from "react-router-dom"

const MovieCard = ({ movie, upcoming = false }) => {
  const handleImgError = (e) => {
    if (e?.target?.src?.includes("/images/popcorn.png")) return
    e.target.src = "/images/popcorn.png"
  }

  const toHref = upcoming ? `/movie/${movie.id}?upcoming=1` : `/movie/${movie.id}`
  return (
    <Link to={toHref} className="group cursor-pointer block">
      <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900 shadow-lg shadow-black/30 mb-3">
        <div className="relative h-72 bg-black">
          <img
            src={movie.image || "/images/popcorn.png"}
            onError={handleImgError}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition">
              {upcoming ? "More" : "Book Now"}
            </button>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-white font-semibold truncate">{movie.title}</h3>
          <p className="text-gray-400 text-sm">{upcoming ? "Coming Soon" : movie.genre}</p>
          <div className="flex justify-between text-xs mt-2">
            {!upcoming && <span className="text-gray-400">{movie.year}</span>}
            {!upcoming && <span className="text-yellow-400">⭐ {movie.rating}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
