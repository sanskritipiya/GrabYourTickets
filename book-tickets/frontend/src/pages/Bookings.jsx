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

  const userEmail = "testuser@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const showRes = await axios.get(
          `http://localhost:3000/api/shows/${showId}`
        );

        const showData = showRes.data.data;
        setShow(showData);

        const cinemaId = showData.cinemaId?._id || showData.cinemaId;

        const seatsRes = await axios.get(
          `http://localhost:3000/api/seats?cinemaId=${cinemaId}`
        );

        // Filter seats by showId and get hallName
        const allSeats = seatsRes.data.seats || [];
        const filteredSeats = allSeats.filter(seat => {
          const seatShowId = seat.showId?._id || seat.showId;
          return seatShowId === showId;
        });

        setSeats(filteredSeats);
      } catch {
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showId]);

  const handleSeatSelect = (selectedSeats) => {
    setSelectedSeatIds(selectedSeats.map(s => s._id));
  };

  const handleBooking = async () => {
    if (!selectedSeatIds.length) {
      alert("Please select seats");
      return;
    }

    await axios.post("http://localhost:3000/api/bookings", {
      showId,
      seatIds: selectedSeatIds,
      userEmail,
    });

    alert("Booking successful! Confirmation email sent.");
  };

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-white text-center">{error}</div>;

  // Extract cinemaId, showId, and hallName for SeatLayout
  const cinemaId = show?.cinemaId?._id || show?.cinemaId;
  const hallName = seats.length > 0 ? seats[0].hallName : null;

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SeatLayout
          seats={seats}
          cinemaId={cinemaId}
          showId={showId}
          hallName={hallName}
          onSeatSelect={handleSeatSelect}
          onConfirm={handleBooking}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
