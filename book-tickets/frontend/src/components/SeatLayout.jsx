import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const SeatLayout = ({
  showId,
  cinemaId,
  hallName,
  movieTitle,
  cinemaName,
  time,
  showDate,
  seats: initialSeats = [],
  onSeatSelect
}) => {
  const navigate = useNavigate()

  const [seats, setSeats] = useState(initialSeats)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [recommendedSeats, setRecommendedSeats] = useState([])
  const [showRecommendation, setShowRecommendation] = useState(false)
  const [seatCount, setSeatCount] = useState(2)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    setSeats(initialSeats)
  }, [initialSeats])

  // -------------------------------
  // ROW NUMBER → LETTER (1=A, 2=B...)
  // -------------------------------
  const rowToLetter = (row) =>
    String.fromCharCode(64 + Number(row))

  // -------------------------------
  // ORGANIZE SEATS
  // -------------------------------
  const seatsByRow = {}

  seats.forEach(seat => {
    if (!seat || seat.row == null || seat.column == null) return

    seat.type = seat.type || "REGULAR"

    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = []
    }
    seatsByRow[seat.row].push(seat)
  })

  Object.keys(seatsByRow).forEach(row => {
    seatsByRow[row].sort((a, b) => a.column - b.column)
  })

  const regularRows = Object.keys(seatsByRow).sort((a, b) => a - b)

  // -------------------------------
  // SEAT INTERACTION
  // -------------------------------
  const handleSeatClick = (seat) => {
    if (seat.status === "BOOKED") return

    const exists = selectedSeats.find(s => s._id === seat._id)
    const updated = exists
      ? selectedSeats.filter(s => s._id !== seat._id)
      : [...selectedSeats, seat]

    setSelectedSeats(updated)
    onSeatSelect(updated)
  }

  const totalPrice = selectedSeats.length * 200

  const getSeatStatus = (seat) => {
    if (seat.status === "BOOKED") return "booked"
    if (selectedSeats.find(s => s._id === seat._id)) return "selected"
    if (recommendedSeats.find(s => s._id === seat._id) && showRecommendation) return "recommended"
    return "available"
  }

  // -------------------------------
  // BOOKING
  // -------------------------------
  const handleBooking = async () => {
    if (!selectedSeats.length) {
      alert("Please select at least one seat")
      return
    }

    setBookingLoading(true)
    try {
      const token = localStorage.getItem("token")
      const seatIds = selectedSeats.map(s => s._id)

      await axios.post(
        "http://localhost:3000/api/bookings",
        { showId, seatIds },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      )

      alert("Booking confirmed!")
      navigate("/")
    } catch {
      alert("Booking failed.")
    } finally {
      setBookingLoading(false)
    }
  }

  // -------------------------------
  // UI (UNCHANGED)
  // -------------------------------
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-gray-900 rounded-lg p-8">

          <div className="text-center mb-8">
            <p className="text-white text-xl font-bold border-b-2 border-gray-600 pb-3">
              SCREEN
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {regularRows.map(row => (
              <div key={row} className="flex items-center gap-3 mb-2">
                <span className="text-white font-semibold w-12 text-sm">
                  Row {rowToLetter(row)}
                </span>

                <div className="flex gap-1.5 flex-wrap">
                  {seatsByRow[row].map(seat => {
                    const status = getSeatStatus(seat)
                    return (
                      <button
                        key={seat._id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === "BOOKED"}
                        className={`w-8 h-8 rounded-t-lg text-[10px] font-semibold ${
                          status === "booked"
                            ? "bg-gray-600"
                            : status === "selected"
                            ? "bg-red-500"
                            : status === "recommended"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {rowToLetter(seat.row)}{seat.column}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 h-fit sticky top-20">
        <h2 className="text-2xl font-semibold text-white mb-6">Booking Summary</h2>

        <p className="text-white mb-4">
          Selected Seats: {selectedSeats.length}
        </p>

        <p className="text-white mb-6">
          Total: ₹{totalPrice}
        </p>

        <button
          onClick={handleBooking}
          disabled={bookingLoading}
          className="w-full bg-red-500 text-white py-3 rounded-lg"
        >
          {bookingLoading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  )
}

export default SeatLayout
