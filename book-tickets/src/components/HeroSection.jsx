import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { moviesData } from "../assets/assets"


const HeroSection = () => {
  // Combine movies from multiple genres into a single array
  // This allows the hero section to cycle through all featured movies continuously
  const allMoviesForHero = [
    ...moviesData.action,
    ...moviesData.thriller,
    ...moviesData.horror,
    ...moviesData.romance,
  ]

  // Track the currently displayed movie index
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  // Auto-slide logic: change the displayed movie every 5 seconds
  // The interval updates currentIndex and loops back to 0 after the last movie
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allMoviesForHero.length)
    }, 5000)

    // Cleanup the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(interval)
  }, [allMoviesForHero.length])

  const currentMovie = allMoviesForHero[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allMoviesForHero.length) % allMoviesForHero.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allMoviesForHero.length)
  }

  return (
    <div
      className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-start overflow-hidden px-6 md:px-12"
      style={{ backgroundImage: `url(${currentMovie.image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-left text-white max-w-3xl px-0">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentMovie.title}</h1>
        <div className="flex flex-wrap justify-start gap-4 mb-6 text-sm md:text-base">
          <span className="bg-red-500 px-3 py-1 rounded">{currentMovie.genre}</span>
          <span>{currentMovie.year}</span>
          <span>⭐ {currentMovie.rating}</span>
        </div>
        <p className="text-gray-200 mb-6 text-sm md:text-base line-clamp-2">{currentMovie.description}</p>
        <button onClick={() => navigate(`/movie/${currentMovie.id}`)} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold transition">
          Explore More →
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-30 hover:bg-opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center transition text-xl"
      >
        ❮
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-30 hover:bg-opacity-50 text-white w-12 h-12 rounded-full flex items-center justify-center transition text-xl"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {allMoviesForHero.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${index === currentIndex ? "bg-red-500" : "bg-gray-400"}`}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default HeroSection
