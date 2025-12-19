import { useState, useMemo } from "react"

const SeatLayout = ({ movieTitle, theatreName, time, onSeatSelect }) => {
  const generateSeats = (totalSeats = 80) => {
    const seats = []
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const seatsPerRow = totalSeats / rows.length

    for (let i = 0; i < rows.length; i++) {
      for (let j = 1; j <= seatsPerRow; j++) {
        seats.push({
          id: `${rows[i]}${j}`,
          row: rows[i],
          number: j,
          status: Math.random() > 0.7 ? "booked" : "available",
          price: rows[i] === "H" ? 300 : rows[i] === "G" ? 250 : 200,
        })
      }
    }
    return seats
  }

  const seats = useMemo(() => generateSeats(), [])
  const [selectedSeats, setSelectedSeats] = useState([])

  const handleSeatClick = (seat) => {
    if (seat.status === "booked") return

    const updatedSeats = selectedSeats.find((s) => s.id === seat.id)
      ? selectedSeats.filter((s) => s.id !== seat.id)
      : [...selectedSeats, seat]

    setSelectedSeats(updatedSeats)
    onSeatSelect(updatedSeats)
  }

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="text-center mb-8">
            <p className="text-white text-lg font-semibold border-b border-gray-700 pb-4">SCREEN</p>
          </div>

          <div className="grid grid-cols-8 gap-3 mb-8">
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status === "booked"}
                title={`${seat.id} - ₹${seat.price}`}
                className={`w-10 h-10 rounded flex items-center justify-center font-semibold text-sm transition ${
                  seat.status === "booked"
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : selectedSeats.find((s) => s.id === seat.id)
                      ? "bg-red-500 text-white"
                      : "bg-green-500 hover:bg-green-400 text-white cursor-pointer"
                }`}
              >
                {seat.number}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-8 bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span className="text-gray-300 text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <span className="text-gray-300 text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
              <span className="text-gray-300 text-sm">Booked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 h-fit sticky top-20">
        <h2 className="text-2xl font-bold text-white mb-6">Booking Summary</h2>

        <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
          <div className="flex justify-between text-gray-300">
            <span>Movie:</span>
            <span className="text-white font-semibold">{movieTitle}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Theatre:</span>
            <span className="text-white font-semibold">{theatreName}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Time:</span>
            <span className="text-white font-semibold">{time}</span>
          </div>
        </div>

        {selectedSeats.length > 0 ? (
          <>
            <h3 className="text-lg font-bold text-white mb-4">Selected Seats</h3>
            <div className="space-y-2 mb-6 pb-6 border-b border-gray-700 max-h-40 overflow-y-auto">
              {selectedSeats.map((seat) => (
                <div key={seat.id} className="flex justify-between text-gray-300 text-sm">
                  <span>{seat.id}</span>
                  <span className="text-red-400">₹{seat.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6 text-lg font-bold text-white">
              <span>Total Amount:</span>
              <span className="text-red-500">₹{totalPrice}</span>
            </div>

            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition">
              Proceed to Payment
            </button>
          </>
        ) : (
          <p className="text-gray-400 text-center py-8">Select seats to continue</p>
        )}
      </div>
    </div>
  )
}

export default SeatLayout
