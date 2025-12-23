import { useState, useEffect } from "react"
import axios from "axios"
import HeroSection from "../components/HeroSection"
import Footer from "../components/Footer"
import MovieCard from "../components/MovieCard"

export default function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/movies")
        setMovies(res.data.data || [])
      } catch (err) {
        console.error(err)
        setError("Failed to fetch movies")
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="bg-gray-950 min-h-screen">
      <HeroSection />

      <div className="max-w-7xl mx-auto">
        {/* NOW SHOWING */}
        <section className="py-10 px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Now Showing</h2>
            <a
              href="/movies"
              className="text-red-500 hover:text-red-400 transition font-medium"
            >
              View All →
            </a>
          </div>

          {loading ? (
            <p className="text-white">Loading movies...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.slice(0, 10).map((movie) => (
                <MovieCard
                  key={movie._id}   // ✅ FIXED KEY
                  movie={movie}
                />
              ))}
            </div>
          ) : (
            <p className="text-white">No movies available</p>
          )}
        </section>
      </div>

      <Footer />
    </div>
  )
}
