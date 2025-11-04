
import { useParams, useSearchParams } from "react-router-dom"
import SeatLayout from "../components/SeatLayout"
import Footer from "../components/Footer"
import { allMovies, theaters } from "../assets/assets"

const Booking = () => {
  const { movieId } = useParams()
  const [searchParams] = useSearchParams()
  const theatreId = Number.parseInt(searchParams.get("theatre"))
  const time = searchParams.get("time")

  const movie = allMovies.find((m) => m.id === Number.parseInt(movieId))
  const theatre = theaters.find((t) => t.id === theatreId)

  const handleSeatSelect = (seats) => {
    console.log("[v0] Selected seats:", seats)
  }

  if (!movie || !theatre) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white text-2xl">
        Booking details not found
      </div>
    )
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Select Your Seats</h1>
          <p className="text-gray-400">
            {movie.title} • {theatre.name} • {time}
          </p>
        </div>

        <SeatLayout
          movieTitle={movie.title}
          theatreName={theatre.name}
          time={time}
          onSeatSelect={handleSeatSelect}
        />
      </div>
      <Footer />
    </div>
  )
}

export default Booking
