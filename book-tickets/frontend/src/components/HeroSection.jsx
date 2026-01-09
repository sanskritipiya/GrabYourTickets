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
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroes.map((hero) => {
          const imageUrl = hero.backgroundImage || "/popcorn.png"
          const movieId = hero.movieId?._id || hero.movieId

          return (
            <div
              key={hero._id}
              className="min-w-full h-full bg-cover bg-center flex items-center relative"
              style={{ backgroundImage: `url(${imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/60" />

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

                {movieId ? (
                  <button
                    onClick={() => navigate(`/movie/${movieId}`)}
                    className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full font-semibold transition-colors"
                  >
                    Explore More →
                  </button>
                ) : (
                  <div className="text-red-400 bg-red-900/30 px-4 py-2 rounded inline-block">
                    ⚠️ No movie linked to this hero
                  </div>
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