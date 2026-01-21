import { useState, useEffect, useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import SeatLayout from "../components/SeatLayout"
import Footer from "../components/Footer"

const Booking = () => {
  const { showId } = useParams()
  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const [show, setShow] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeatIds, setSelectedSeatIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBooking, setIsBooking] = useState(false)

  /* ================= LOGIN REQUIRED ================= */
  useEffect(() => {
    if (!token) {
      toast.warning("Please log in to book tickets", {
        autoClose: 2000,
        hideProgressBar: true,
        style: {
          background: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        },
      })
      navigate("/login", { replace: true })
    }
  }, [token, navigate])

  // Block render while redirecting
  if (!token) return null

  /* ================= VERIFY USER ROLE ================= */
  useEffect(() => {
    const verifyUserRole = async () => {
      try {
        const userRes = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const userRole = userRes.data.data?.role || userRes.data.role

        if (userRole === "admin") {
          toast.warning("Admins cannot book tickets from user portal", {
            autoClose: 2000,
            hideProgressBar: true,
            style: {
              background: "#fef3c7",
              color: "#92400e",
              border: "1px solid #fcd34d",
            },
          })
          navigate("/", { replace: true })
        }
      } catch (err) {
        console.error("Role verification error:", err)
      }
    }

    verifyUserRole()
  }, [token, navigate])

  /* ================= FETCH SHOW + SEATS ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const showRes = await axios.get(
          `http://localhost:3000/api/shows/${showId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        const showData = showRes.data.data
        setShow(showData)

        const cinemaId =
          showData.cinemaId?._id?.toString() ||
          showData.cinemaId?.toString()

        const seatsRes = await axios.get(
          `http://localhost:3000/api/seats?cinemaId=${cinemaId}&showId=${showId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        setSeats(seatsRes.data.seats || [])
      } catch (err) {
        console.error(err)

        if (err.response?.status === 401) {
          toast.warning("Session expired. Please log in again.", {
            hideProgressBar: true,
          })
          localStorage.removeItem("token")
          navigate("/login", { replace: true })
          return
        }

        setError("Failed to load booking details")
        toast.error("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [showId, token, navigate])

  /* ================= CINEMA ID ================= */
  const cinemaId = useMemo(() => {
    return show?.cinemaId?._id?.toString() || show?.cinemaId?.toString()
  }, [show])

  /* ================= SEAT SELECTION ================= */
  const handleSeatSelect = useCallback((selectedSeats) => {
    setSelectedSeatIds(selectedSeats.map((s) => s._id))
  }, [])

  /* ================= BOOKING ================= */
  const handleBooking = useCallback(async () => {
    if (!selectedSeatIds.length) {
      toast.error("Please select at least one seat")
      return { success: false }
    }

    setIsBooking(true)

    try {
      const response = await axios.post(
        "http://localhost:3000/api/bookings",
        { showId, seatIds: selectedSeatIds },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.data.success) {
        await new Promise((r) => setTimeout(r, 1500))

        toast.success(
          response.data.emailSent
            ? "Booking successful! Confirmation email sent."
            : "Booking successful! Email failed to send.",
          {
            autoClose: 3000,
            hideProgressBar: true,
            style: {
              background: "#d1fae5",
              color: "#065f46",
              border: "1px solid #6ee7b7",
            },
          }
        )

        setTimeout(() => navigate("/"), 3000)
      }

      return response.data
    } catch (err) {
      console.error("Booking error:", err)

      if (err.response?.status === 401) {
        toast.warning("Session expired. Please log in again.", {
          hideProgressBar: true,
        })
        localStorage.removeItem("token")
        navigate("/login", { replace: true })
        return { success: false }
      }

      toast.error(
        err.response?.data?.message || "Booking failed. Please try again."
      )
      return { success: false }
    } finally {
      setIsBooking(false)
    }
  }, [selectedSeatIds, showId, token, navigate])

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  const hallName =
    seats.length && seats[0].hallName ? seats[0].hallName.trim() : ""

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <ToastContainer theme="dark" position="top-center" />
      <SeatLayout
        seats={seats}
        cinemaId={cinemaId}
        showId={showId}
        hallName={hallName}
        movieTitle={show?.movieId?.title}
        cinemaName={show?.cinemaId?.name}
        showTime={show?.time}
        showDate={show?.showDate}
        onSeatSelect={handleSeatSelect}
        onConfirm={handleBooking}
        isBooking={isBooking}
      />
      <Footer />
    </div>
  )
}

export default Booking
