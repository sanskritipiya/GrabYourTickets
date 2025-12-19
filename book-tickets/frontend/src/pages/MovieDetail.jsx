import { useMemo, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { allMovies, showtimes, theatres, timings, upcomingReleases } from '../assets/assets'

const MovieDetail = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isUpcoming = searchParams.get('upcoming') === '1'
  const movieId = Number(id)

  const movie = useMemo(() => allMovies.find((m) => m.id === movieId), [movieId])
  const upcoming = useMemo(() => upcomingReleases.find((r) => r.id === movieId), [movieId])

  const movieShowtimes = useMemo(() => showtimes.filter((s) => s.movieId === movieId), [movieId])

  const theatreByName = (name) => theatres.find((t) => t.name === name)
  const [showPicker, setShowPicker] = useState(false)

  // If there are no showtimes defined for this movie, generate sensible defaults
  const fallbackShowtimes = useMemo(() => {
    if (movieShowtimes.length > 0) return movieShowtimes
    const generated = []
    const timesToUse = timings.slice(0, 3)
    theatres.forEach((th) => {
      timesToUse.forEach((time, idx) => {
        generated.push({
          id: Number(`${th.id}${idx}`),
          movieId,
          cinema: th.name,
          time,
          format: idx === 1 ? 'IMAX' : '2D',
          price: 300 + idx * 100,
        })
      })
    })
    return generated
  }, [movieShowtimes, movieId])

  if (!movie && !isUpcoming) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Movie not found.</p>
          <Link to="/" className="text-red-400 hover:text-red-300">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img src={(isUpcoming ? upcoming?.image : movie?.image) || '/images/popcorn.png'} alt={isUpcoming ? upcoming?.title : movie?.title} className="w-full rounded-xl object-cover" />
          </div>
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{(isUpcoming ? upcoming?.title : movie?.title) || movie?.title}</h1>
            {/* Upcoming detail content */}
            {isUpcoming && upcoming && (
              <>
                {upcoming.description && <p className="text-gray-300 mb-6">{upcoming.description}</p>}
                <div className="text-sm text-gray-400 space-y-1">
                  {upcoming.director && (
                    <p>
                      <span className="text-gray-500">Director:</span> {upcoming.director}
                    </p>
                  )}
                  {upcoming.cast && (
                    <p>
                      <span className="text-gray-500">Cast:</span> {upcoming.cast.join(', ')}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Current movie detail content */}
            {!isUpcoming && movie && (
              <>
                <div className="flex flex-wrap gap-3 text-sm text-gray-300 mb-4">
                  {movie.genre && <span className="bg-red-500 text-white px-3 py-1 rounded">{movie.genre}</span>}
                  {movie.year && <span>{movie.year}</span>}
                  {movie.rating && <span>⭐ {movie.rating}</span>}
                  {movie.duration ? <span>{movie.duration} min</span> : null}
                  {movie.language ? <span>{movie.language}</span> : null}
                  {movie.certification ? <span>{movie.certification}</span> : null}
                </div>
                {movie.description && <p className="text-gray-300 mb-6">{movie.description}</p>}
                <div className="text-sm text-gray-400 space-y-1">
                  {movie.director && <p><span className="text-gray-500">Director:</span> {movie.director}</p>}
                  {movie.cast && <p><span className="text-gray-500">Cast:</span> {movie.cast.join(', ')}</p>}
                </div>
              </>
            )}
            {isUpcoming && upcoming?.releaseDate && (
              <p className="text-gray-300 mt-6">Releasing on {upcoming.releaseDate}</p>
            )}
          </div>
        </div>

        {/* Booking */}
        {!isUpcoming && (
          <div className="mt-10">
            <button onClick={() => setShowPicker((s) => !s)} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded font-semibold">
              {showPicker ? 'Hide Showtimes' : 'Book Now'}
            </button>
          </div>
        )}

        {/* Theatre & time picker */}
        {!isUpcoming && showPicker && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Select Theatre & Time</h2>
            <div className="space-y-6">
              {Array.from(new Set(fallbackShowtimes.map((s) => s.cinema))).map((cinema) => {
                const theatre = theatreByName(cinema)
                const times = fallbackShowtimes.filter((s) => s.cinema === cinema)
                return (
                  <div key={cinema} className="bg-gray-900/60 rounded-lg p-4 border border-gray-800">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <p className="font-semibold">{cinema}</p>
                        <p className="text-sm text-gray-400">{theatre?.location || '—'}</p>
                      </div>
                      <p className="text-sm text-gray-400">Amenities: {(theatre?.amenities || []).slice(0,3).join(', ')}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {times.map((t) => (
                        <Link
                          key={t.id}
                          to={`/booking/${movieId}?theatre=${theatre?.id}&time=${encodeURIComponent(t.time)}`}
                          className="px-4 py-2 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 text-sm"
                        >
                          {t.time} • {t.format} • ₹{t.price}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetail