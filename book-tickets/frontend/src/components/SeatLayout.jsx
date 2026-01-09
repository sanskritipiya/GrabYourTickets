import { useState, useEffect, useMemo } from "react"
import { toast } from "react-toastify"

const SEAT_PRICE = 800

const SeatLayout = ({
  showId,
  cinemaId,
  hallName,
  seats: initialSeats = [],
  movieTitle,
  cinemaName,
  showTime,
  showDate,
  onSeatSelect,
  onConfirm,
  isBooking = false,
}) => {
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])

  /* ===== RECOMMENDATION STATE ===== */
  const [recommendMode, setRecommendMode] = useState(null)
  const [loadingReco, setLoadingReco] = useState(false)
  const [recommendedGroups, setRecommendedGroups] = useState([])
  const [peopleCount, setPeopleCount] = useState(2)

  /* ===== AUTH CHECK ===== */
  const token = localStorage.getItem("token")
  const isLoggedIn = !!token

  /* ================= SYNC SEATS ================= */
  useEffect(() => {
    console.log("SeatLayout received initialSeats:", initialSeats)
    if (Array.isArray(initialSeats)) {
      setSeats(initialSeats)
      console.log("SeatLayout seats set to:", initialSeats.length, "seats")
    } else {
      console.warn("SeatLayout: initialSeats is not an array:", initialSeats)
      setSeats([])
    }
  }, [initialSeats])

  /* ===== ROWS ===== */
  const rows = useMemo(() => {
    if (!seats.length) {
      console.log("SeatLayout: No seats, returning empty rows")
      return []
    }

    const uniqueRows = [...new Set(seats.map((s) => s.row))]
      .filter(Boolean)
      .sort()
    
    console.log("SeatLayout: Rows calculated:", uniqueRows)
    return uniqueRows
  }, [seats])

  /* ================= SEATS BY ROW ================= */
  const seatsByRow = useMemo(() => {
    if (!rows.length) return {}

    const map = {}
    rows.forEach((row) => {
      map[row] = seats
        .filter((s) => s.row === row)
        .sort((a, b) => a.column - b.column)
    })
    return map
  }, [rows, seats])

  /* ================= CHECK IF RECOMMENDED ================= */
  const isRecommendedSeat = (seatId) => {
    if (!recommendMode || recommendedGroups.length === 0) return false

    return recommendedGroups.some((group) =>
      group.seats.some((s) => s.seatId.toString() === seatId.toString())
    )
  }

  /* ================= SEAT STATUS ================= */
  const getSeatStatus = (seat) => {
    if (seat.status === "BOOKED") return "booked"
    if (selectedSeats.some((s) => s._id === seat._id)) return "selected"
    if (isRecommendedSeat(seat._id)) return "recommended"
    return "available"
  }

  /* ================= TOGGLE SEAT (Clear recommendations on manual click) ================= */
  const handleSeatClick = (seat) => {
    if (seat.status === "BOOKED") return

    // Check if user is logged in
    if (!isLoggedIn) {
      toast.warning("Please log in to book tickets", {
        style: {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        },
        hideProgressBar: true,
      })
      return
    }

    // Clear recommendations when user manually clicks a seat
    if (recommendMode) {
      setRecommendMode(null)
      setRecommendedGroups([])
    }

    setSelectedSeats((prev) =>
      prev.some((s) => s._id === seat._id)
        ? prev.filter((s) => s._id !== seat._id)
        : [...prev, seat]
    )
  }

  /* ================= EMIT ================= */
  useEffect(() => {
    onSeatSelect?.(selectedSeats)
  }, [selectedSeats, onSeatSelect])

  /* ================= FETCH RECOMMENDATION ================= */
  const fetchRecommendedSeats = async (mode) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      toast.warning("Please log in to book tickets", {
        style: {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        },
        hideProgressBar: true,
      })
      return
    }

    if (recommendMode === mode) {
      setRecommendMode(null)
      setRecommendedGroups([])
      setSelectedSeats([])
      return
    }

    try {
      setLoadingReco(true)
      setRecommendMode(mode)
      setSelectedSeats([])

      const url = `http://localhost:3000/api/seats/recommend?cinemaId=${cinemaId}&showId=${showId}&hallName=${encodeURIComponent(hallName)}&count=${peopleCount}&mode=${mode}`
      console.log("Fetching recommendations from:", url)

      const res = await fetch(url)
      const data = await res.json()
      
      console.log("Recommendation API response:", data)

      if (!res.ok || !data.success) {
        console.log("API returned error:", data.message)
        alert(data.message || "No seats available for recommendation")
        setRecommendedGroups([])
        setRecommendMode(null)
        return
      }

      // Handle both response formats
      const groups = data.recommendedGroups || []
      console.log("Setting recommended groups:", groups)
      setRecommendedGroups(groups)
    } catch (err) {
      console.error("Recommendation fetch error:", err)
      setRecommendMode(null)
      setRecommendedGroups([])
    } finally {
      setLoadingReco(false)
    }
  }

  /* ================= GROUP CLICK (Keep recommendations visible) ================= */
  const handleGroupClick = (groupSeats) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      toast.warning("Please log in to book tickets", {
        style: {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        },
        hideProgressBar: true,
      })
      return
    }

    const ids = groupSeats.map((s) => s.seatId.toString())

    const matched = seats.filter((s) =>
      ids.some((id) => id === s._id.toString())
    )

    // Don't clear recommendations when clicking a recommended group
    setSelectedSeats(matched)
  }

  /* ================= CONFIRM BOOKING ================= */
  const handleConfirmBooking = async () => {
    // Check if user is logged in
    if (!isLoggedIn) {
      toast.warning("Please log in to book tickets", {
        style: {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        },
        hideProgressBar: true,
      })
      return
    }

    try {
      const res = await onConfirm()
      if (!res?.success) {
        console.warn("Booking failed:", res)
      } else {
        setSelectedSeats([])
        setRecommendMode(null)
        setRecommendedGroups([])
      }
    } catch (error) {
      console.error("Booking confirmation error:", error)
    }
  }

  const totalPrice = selectedSeats.length * SEAT_PRICE

  /* ================= SEAT ICON SVG ================= */
  const SeatIcon = ({ status }) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M4 12h1.5v7H4v-7zm14.5 0H20v7h-1.5v-7zM7 10c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v9H7v-9z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <rect x="6" y="19" width="12" height="1.5" rx="0.5" fill="currentColor" />
    </svg>
  )

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

        {/* LEFT */}
        <div className="flex-1 space-y-8">
          <h1 className="text-4xl font-semibold text-red-500">
            Select Your Seats
          </h1>

          <p className="text-neutral-400 -mt-4">
            {movieTitle} • {cinemaName} • {showTime} • {showDate}
          </p>

          {/* SCREEN */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-3/4 h-10 border-t-4 border-red-500 rounded-t-full" />
            <span className="text-xs tracking-widest text-neutral-400">
              SCREEN
            </span>
          </div>

          {/* LEGEND */}
          <div className="flex gap-6 justify-center text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-neutral-800 rounded"></div>
              Available
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-600 rounded"></div>
              Selected
            </div>
            {recommendMode && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-500 rounded"></div>
                Recommended
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-neutral-700 rounded"></div>
              Booked
            </div>
          </div>

          {/* SEATS */}
          <div className="flex justify-center gap-6 bg-neutral-900 p-6 rounded-xl">
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <div
                  key={row}
                  className="h-14 w-6 text-neutral-500 flex items-center justify-center text-sm"
                >
                  {row}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row} className="flex gap-2">
                  {seatsByRow[row].map((seat) => {
                    const status = getSeatStatus(seat)

                    return (
                      <button
                        key={seat._id}
                        disabled={status === "booked"}
                        onClick={() => handleSeatClick(seat)}
                        className={`relative w-14 h-14 rounded-lg transition-all group
                          ${status === "available" && "bg-neutral-800 hover:bg-neutral-700 text-neutral-400"}
                          ${status === "selected" && "bg-red-600 text-white"}
                          ${status === "recommended" && "bg-amber-500 hover:bg-amber-600 text-white"}
                          ${status === "booked" && "bg-neutral-700 text-neutral-600 cursor-not-allowed opacity-50"}
                        `}
                        title={status === "booked" ? "This seat is already booked" : seat.seatNumber}
                      >
                        <div className="p-2">
                          <SeatIcon status={status} />
                        </div>
                        <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium
                          ${status === "available" ? "opacity-0 group-hover:opacity-100" : "opacity-100"}
                        `}>
                          {seat.seatNumber}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-96 bg-neutral-900 p-6 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold text-red-500">
            Seat Recommendation
          </h2>

          <div>
            <label className="text-xs text-neutral-400 block mb-1">
              Number of seats
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={peopleCount}
              onChange={(e) => setPeopleCount(+e.target.value || 1)}
              className="w-full bg-neutral-800 px-3 py-2 rounded text-white"
            />
          </div>

          <button
            onClick={() => fetchRecommendedSeats("best")}
            disabled={loadingReco}
            className={`w-full py-2 rounded transition ${
              recommendMode === "best"
                ? "bg-red-600"
                : "bg-neutral-800 hover:bg-neutral-700"
            } ${loadingReco ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loadingReco && recommendMode === "best"
              ? "Loading..."
              : "Best Seats in Hall"}
          </button>

          <button
            onClick={() => fetchRecommendedSeats("row")}
            disabled={loadingReco}
            className={`w-full py-2 rounded transition ${
              recommendMode === "row"
                ? "bg-red-600"
                : "bg-neutral-800 hover:bg-neutral-700"
            } ${loadingReco ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loadingReco && recommendMode === "row"
              ? "Loading..."
              : "Best Seats in Same Row"}
          </button>

          {recommendedGroups.length > 0 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs text-neutral-400">
                {recommendedGroups.length} option
                {recommendedGroups.length > 1 ? "s" : ""} found - Click to
                select:
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {recommendedGroups.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => handleGroupClick(g.seats)}
                    className="w-full text-sm bg-neutral-800 hover:bg-neutral-700 py-2 px-3 rounded transition text-left"
                  >
                    <span className="text-amber-500 font-semibold">
                      Row {g.row}
                    </span>
                    <span className="text-neutral-400">
                      {" "}
                      • {g.seats.map((s) => s.label).join(", ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-neutral-800 pt-4">
            <h2 className="text-lg font-semibold text-red-500 mb-3">
              Order Summary
            </h2>

            {selectedSeats.length === 0 ? (
              <p className="text-sm text-neutral-500 italic mb-4">
                No seats selected
              </p>
            ) : (
              <>
                <p className="text-sm text-neutral-300 mb-2">
                  <span className="text-neutral-500">Seats:</span>{" "}
                  {selectedSeats.map((s) => s.seatNumber).join(", ")}
                </p>

                <div className="flex justify-between text-red-500 font-semibold text-lg mb-4">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </>
            )}

            <button
              disabled={!selectedSeats.length || isBooking}
              onClick={handleConfirmBooking}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded transition disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
            >
              {isBooking ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout