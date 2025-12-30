import { useState, useEffect, useMemo } from "react"

const SEAT_PRICE = 800 // ₹

export default function SeatLayout({
  seats = [],
  cinemaId,
  showId,
  hallName,
  onSeatSelect,
  onConfirm,
}) {
  const [selectedSeats, setSelectedSeats] = useState([])
  const [recommendMode, setRecommendMode] = useState(null)
  const [loadingReco, setLoadingReco] = useState(false)
  const [recommendedSeatsList, setRecommendedSeatsList] = useState([])

  /* ================= ROWS ================= */
  const rows = useMemo(() => {
    const uniqueRows = [...new Set(seats.map(s => s.row))]
    return uniqueRows.sort()
  }, [seats])

  /* ================= SEATS BY ROW ================= */
  const seatsByRow = useMemo(() => {
    const map = {}
    rows.forEach(row => {
      map[row] = seats
        .filter(s => s.row === row)
        .sort((a, b) => a.column - b.column)
    })
    return map
  }, [rows, seats])

  /* ================= SEAT STATUS ================= */
  const getSeatStatus = seat => {
    if (seat.status !== "AVAILABLE") return "unavailable"
    if (selectedSeats.find(s => s._id === seat._id)) return "selected"
    return "available"
  }

  /* ================= TOGGLE SEAT ================= */
  const handleSeatToggle = seat => {
    setSelectedSeats(prev =>
      prev.find(s => s._id === seat._id)
        ? prev.filter(s => s._id !== seat._id)
        : [...prev, seat]
    )
  }

  /* ================= EMIT SELECTED ================= */
  useEffect(() => {
    onSeatSelect(selectedSeats)
  }, [selectedSeats, onSeatSelect])

  /* ================= FETCH RECOMMENDATION ================= */
  const fetchRecommendedSeats = async (mode, count = 2) => {
    try {
      setLoadingReco(true)

      const res = await fetch(
        `http://localhost:3000/api/seats/recommend?cinemaId=${cinemaId}&showId=${showId}&hallName=${hallName}&count=${count}&mode=${mode}`
      )

      const data = await res.json()

      if (data.success && data.recommendedSeats) {
        // Store the list of recommended seats for display
        setRecommendedSeatsList(data.recommendedSeats)
        
        // Auto-select the first recommendation (optional - you can remove this if you want users to click)
        // For "best" mode, don't auto-select, let users choose
        if (mode === "row" || mode === "ROW") {
          const recommended = seats.filter(seat =>
            data.recommendedSeats.some(r => r.seatId === seat._id)
          )
          setSelectedSeats(recommended)
        }
      }
    } catch (err) {
      console.error("Recommendation failed", err)
    } finally {
      setLoadingReco(false)
    }
  }

  /* ================= HANDLE RECOMMENDATION CLICK ================= */
  const handleRecommendationClick = (recommendedSeat) => {
    const seat = seats.find(s => s._id === recommendedSeat.seatId)
    if (seat && seat.status === "AVAILABLE") {
      handleSeatToggle(seat)
    }
  }

  const totalPrice = selectedSeats.length * SEAT_PRICE

  /* ================= UI ================= */
  return (
    <div className="flex flex-row gap-8 p-6 md:p-12 max-w-7xl mx-auto">
      {/* ================= LEFT ================= */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-4xl font-light mb-2">Select Your Seat</h1>
          <p className="text-muted-foreground">
            Choose your perfect spot for an unforgettable experience
          </p>
        </div>

        {/* SCREEN */}
        <div className="space-y-8">
          <div className="flex justify-center">
            <div className="w-3/4 h-2 bg-gradient-to-b from-muted/60 to-muted/30 rounded-full blur-sm" />
          </div>
          <p className="text-center text-sm uppercase tracking-widest text-muted-foreground">
            Screen
          </p>

          {/* SEATS */}
          <div className="flex gap-8 justify-center">
            {/* ROW LABELS */}
            <div className="flex flex-col pt-1">
              {rows.map(row => (
                <div
                  key={row}
                  className="h-12 w-6 flex items-center justify-center text-sm text-muted-foreground"
                >
                  {row}
                </div>
              ))}
            </div>

            {/* GRID */}
            <div className="space-y-1">
              {rows.map(row => (
                <div key={row} className="flex gap-1">
                  {seatsByRow[row].map(seat => {
                    const status = getSeatStatus(seat)

                    return (
                      <button
                        key={seat._id}
                        disabled={status === "unavailable"}
                        onClick={() => handleSeatToggle(seat)}
                        className={`
                          w-12 h-12 rounded-md text-xs transition-all
                          ${seat.isBestRow ? "ring-2 ring-yellow-400" : ""}
                          ${
                            status === "available"
                              ? "bg-muted hover:bg-primary/20 border"
                              : status === "selected"
                              ? "bg-primary text-white scale-105"
                              : "bg-muted/50 opacity-50 cursor-not-allowed"
                          }
                        `}
                      >
                        {status === "selected" ? "✓" : seat.seatNumber}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="w-80">
        <div className="bg-card border rounded-lg p-6 space-y-6 sticky top-6">
          <h2 className="text-lg font-semibold uppercase">Recommendations</h2>

          <div className="space-y-2">
            <button
              disabled={loadingReco}
              onClick={() => {
                setRecommendMode("BEST")
                fetchRecommendedSeats("best", 2)
              }}
              className={`w-full py-2 rounded font-medium ${
                recommendMode === "BEST"
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              Best Seats
            </button>

            <button
              disabled={loadingReco}
              onClick={() => {
                setRecommendMode("ROW")
                fetchRecommendedSeats("row", selectedSeats.length || 2)
              }}
              className={`w-full py-2 rounded font-medium ${
                recommendMode === "ROW"
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              Same Row
            </button>
          </div>

          {/* RECOMMENDED SEATS LIST */}
          {recommendedSeatsList.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {recommendedSeatsList.map((recSeat) => {
                  const seat = seats.find(s => s._id === recSeat.seatId)
                  const isSelected = selectedSeats.some(s => s._id === recSeat.seatId)
                  const isAvailable = seat && seat.status === "AVAILABLE"
                  
                  return (
                    <button
                      key={recSeat.seatId}
                      disabled={!isAvailable}
                      onClick={() => handleRecommendationClick(recSeat)}
                      className={`
                        px-3 py-1.5 rounded-md text-xs font-medium transition-all
                        ${
                          isSelected
                            ? "bg-primary text-white"
                            : isAvailable
                            ? "bg-muted hover:bg-primary/20 border cursor-pointer"
                            : "bg-muted/50 opacity-50 cursor-not-allowed"
                        }
                      `}
                    >
                      {recSeat.label || `${recSeat.row}${recSeat.column}`}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {loadingReco && (
            <div className="text-sm text-muted-foreground">Loading recommendations...</div>
          )}

          {/* ORDER SUMMARY */}
          <div className="border-t pt-4 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            {selectedSeats.length === 0 ? (
              <p className="text-sm text-muted-foreground">No seats selected</p>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Seats ({selectedSeats.length})</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            )}

            <button
              disabled={selectedSeats.length === 0}
              onClick={onConfirm}
              className={`w-full py-3 rounded-lg font-medium ${
                selectedSeats.length === 0
                  ? "bg-muted cursor-not-allowed"
                  : "bg-primary text-white hover:opacity-90"
              }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}