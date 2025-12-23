import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SeatLayout from "../components/SeatLayout";
import Footer from "../components/Footer";

const Booking = () => {
  const { showId } = useParams();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hallName, setHallName] = useState("Hall 1");

  // ⚠️ TEMP: replace with logged-in user's email or JWT later
  const userEmail = "testuser@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch show
        const showRes = await axios.get(
          `http://localhost:3000/api/shows/${showId}`
        );

        const showData = showRes.data.data;
        if (!showData) {
          setError("Show not found");
          return;
        }

        setShow(showData);

        const cinemaId = showData.cinemaId?._id || showData.cinemaId;

        // Fetch seats
        const seatsRes = await axios.get(
          `http://localhost:3000/api/seats?cinemaId=${cinemaId}`
        );

        const allSeats = seatsRes.data.seats || [];

        if (allSeats.length > 0) {
          const halls = [...new Set(allSeats.map(s => s.hallName))];
          const selectedHall = halls[0] || "Hall 1";
          setHallName(selectedHall);

          setSeats(allSeats.filter(s => s.hallName === selectedHall));
        } else {
          setSeats([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    if (showId) fetchData();
  }, [showId]);

  // ✅ RECEIVE SEATS → STORE ONLY IDS
  const handleSeatSelect = (selectedSeats) => {
    console.log("Selected seats:", selectedSeats);

    const ids = selectedSeats.map(seat => seat._id);
    setSelectedSeatIds(ids);
  };

  // ✅ ACTUAL BOOKING CALL
  const handleBooking = async () => {
    if (selectedSeatIds.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    try {
      console.log("BOOKING PAYLOAD", {
        showId,
        seatIds: selectedSeatIds,
        userEmail,
      });

      const res = await axios.post(
        "http://localhost:3000/api/bookings",
        {
          showId,
          seatIds: selectedSeatIds,
          userEmail,
        }
      );

      alert("Booking successful!");
      console.log(res.data);
    } catch (err) {
      console.error("Booking error:", err.response?.data);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center text-white text-2xl">
        {error || "Booking details not found"}
      </div>
    );
  }

  const movie = show.movieId;
  const cinema = show.cinemaId;

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-2">
            Select Your Seats
          </h1>
          <p className="text-gray-400 text-lg">
            {movie?.title} • {cinema?.name} • {show.time} • {show.showDate}
          </p>
        </div>

        <SeatLayout
          seats={seats}
          onSeatSelect={handleSeatSelect}
        />

        <button
          onClick={handleBooking}
          className="mt-6 bg-red-600 px-6 py-3 rounded hover:bg-red-700"
        >
          Confirm Booking
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
