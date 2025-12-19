import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { moviesData } from "../assets/assets"

const HeroSection = () => {
  const navigate = useNavigate()
  const allMoviesForHero = [
    ...moviesData.action,
    ...moviesData.sciFi,
    ...moviesData.thriller,
    ...moviesData.horror,
    ...moviesData.romance,
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allMoviesForHero.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [allMoviesForHero.length])

  const currentMovie = allMoviesForHero[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allMoviesForHero.length) % allMoviesForHero.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allMoviesForHero.length)
  }

  if (!currentMovie) return null

  const imageUrl = currentMovie.image || '/popcorn.png'

  return (
    <div
      className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-start overflow-hidden"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>


      <div className="relative z-10 text-left text-white max-w-3xl px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentMovie.title}</h1>
        <div className="flex flex-wrap gap-4 mb-6 text-sm md:text-base">
          {currentMovie.genre && <span className="bg-red-500 px-3 py-1 rounded">{currentMovie.genre}</span>}
          {currentMovie.language && <span>{currentMovie.language}</span>}
          {currentMovie.rating && <span>⭐ {currentMovie.rating}</span>}
        </div>
        {currentMovie.description && (
          <p className="text-gray-200 mb-6 text-sm md:text-base line-clamp-2">{currentMovie.description}</p>
        )}
        <button 
          onClick={() => navigate(`/movie/${currentMovie.id}`)}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold transition"
        >
          Explore Now →
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition text-2xl font-bold shadow-lg"
        aria-label="Previous movie"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition text-2xl font-bold shadow-lg"
        aria-label="Next movie"
      >
        ›
      </button>

    </div>
  )
}

export default HeroSection
