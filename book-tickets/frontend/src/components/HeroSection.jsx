import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const HeroSection = () => {
  const navigate = useNavigate()
  const [heroes, setHeroes] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/heroes")
        setHeroes(res.data.data || [])
      } catch (error) {
        console.error("Hero fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroes()
  }, [])

  // 🔁 AUTO SLIDE
  useEffect(() => {
    if (heroes.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === heroes.length - 1 ? 0 : prev + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [heroes])

  if (loading || heroes.length === 0) return null

  return (
    <div className="relative overflow-hidden h-96 md:h-[500px]">
      {/* SLIDER TRACK */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroes.map((hero) => {
          const imageUrl = hero.backgroundImage || "/popcorn.png"
          // Extract movieId - handle both string and populated object cases, ensure it's a string
          const movieIdRaw = hero.movieId?._id || hero.movieId
          const movieId = movieIdRaw ? String(movieIdRaw) : null

          // Create a handler function for each hero to ensure correct movieId is used
          const handleExploreClick = () => {
            if (movieId) {
              navigate(`/movie/${movieId}`)
            }
          }

          return (
            <div
              key={hero._id}
              className="min-w-full h-full bg-cover bg-center flex items-center relative"
              style={{ backgroundImage: `url(${imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/60"></div>

              <div className="relative z-10 text-white px-6 md:px-12 max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {hero.title}
                </h1>

                {hero.subtitle && (
                  <p className="text-lg text-gray-300 mb-4">
                    {hero.subtitle}
                  </p>
                )}

                {hero.description && (
                  <p className="mb-6 text-gray-200">
                    {hero.description}
                  </p>
                )}

                {/* ✅ MOVIE ID BASED NAVIGATION - Always show button if movieId exists */}
                {movieId && (
                  <button
                    onClick={handleExploreClick}
                    className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full font-semibold transition-colors"
                  >
                    {hero.ctaText || "Explore More"} →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HeroSection