import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
};

const MyTickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:3000/api/bookings/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🎟 My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Movie</th>
                <th className="p-3 border">Cinema</th>
                <th className="p-3 border">Show Date</th>
                <th className="p-3 border">Show Time</th>
                <th className="p-3 border">Seats</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Booked On</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="text-center">
                  <td className="p-3 border">
                    {booking.showId?.movieId?.title || "N/A"}
                  </td>

                  <td className="p-3 border">
                    {booking.showId?.cinemaId?.name || "N/A"}
                  </td>

                  <td className="p-3 border">
                    {booking.showId?.showDate
                      ? new Date(
                          booking.showId.showDate
                        ).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>

                  <td className="p-3 border">
                    {booking.showId?.time || "N/A"}
                  </td>

                  <td className="p-3 border">
                    {booking.seatIds?.length > 0
                      ? booking.seatIds
                          .map((seat) => seat.seatNumber)
                          .join(", ")
                      : "N/A"}
                  </td>

                  <td className="p-3 border">
                    Rs. {booking.totalAmount}
                  </td>

                  {/* ✅ BOOKED DATE + TIME */}
                  <td className="p-3 border">
                    {formatDateTime(booking.createdAt)}
                  </td>

                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.bookingStatus === "CONFIRMED"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Back to Home */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
};

export default MyTickets;
