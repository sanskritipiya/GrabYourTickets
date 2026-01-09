import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import Footer from "../components/Footer"

const LOCATIONS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Chitwan",
  "Butwal",
  "Itahari",
  "Biratnagar",
  "Dharan",
  "Hetauda",
]

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [movieIdsByLocation, setMovieIdsByLocation] = useState([])
  const [loading, setLoading] = useState(true)
  const [locationLoading, setLocationLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("") // ✅ single location

  /* ================= FETCH ALL MOVIES ================= */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/movies")
        setMovies(res.data?.data || [])
      } catch (err) {
        console.error("Failed to fetch movies", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  /* ================= FETCH SHOWS BY LOCATION ================= */
  useEffect(() => {
    if (!selectedLocation) {
      setMovieIdsByLocation([])
      return
    }

    setLocationLoading(true)

    const fetchShows = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/shows", {
          params: { location: selectedLocation },
        })

        const shows = res.data?.data || []

        // ✅ DEDUPLICATE MOVIE IDS
        const ids = [
          ...new Set(
            shows
              .map(show => show.movieId?._id)
              .filter(Boolean)
          )
        ]

        setMovieIdsByLocation(ids)
      } catch (err) {
        console.error("Failed to fetch shows", err)
      } finally {
        setLocationLoading(false)
      }
    }

    fetchShows()
  }, [selectedLocation])

  /* ================= FILTER MOVIES ================= */
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const searchMatch =
        movie.title?.toLowerCase().includes(search.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(search.toLowerCase())

      const locationMatch =
        !selectedLocation || movieIdsByLocation.includes(movie._id)

      return searchMatch && locationMatch
    })
  }, [movies, search, selectedLocation, movieIdsByLocation])

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading movies...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <h1 className="text-4xl font-bold text-white mb-1">
          Discover Movies
        </h1>
        <p className="text-gray-400 mb-6">
          Explore movies by title and location
        </p>

        {/* SEARCH */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search movies..."
          className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700"
        />

        <div className="flex gap-6">
          {/* FILTER */}
          <aside className="w-64 bg-gray-900 rounded-xl p-4 h-fit">
            <h3 className="text-white font-semibold mb-4">
              📍 Filter by Location
            </h3>

            {LOCATIONS.map(loc => (
              <label
                key={loc}
                className="flex items-center gap-3 mb-3 cursor-pointer text-gray-300"
              >
                <input
                  type="checkbox"
                  checked={selectedLocation === loc}
                  onChange={() =>
                    setSelectedLocation(
                      selectedLocation === loc ? "" : loc
                    )
                  }
                  className="accent-blue-600"
                />
                {loc}
              </label>
            ))}
          </aside>

          {/* MOVIES */}
          <main className="flex-1">
            <p className="text-gray-400 mb-4">
              Found {filteredMovies.length} movies
            </p>

            <div
              className={`transition-opacity duration-300 ${
                locationLoading ? "opacity-50" : "opacity-100"
              }`}
            >
              {filteredMovies.length === 0 ? (
                <p className="text-center mt-20 text-gray-400">
                  {locationLoading
                    ? "Loading movies..."
                    : "No movies for this location"}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredMovies.map(movie => (
                    <MovieCard key={movie._id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Movies
