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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-500 text-lg">View and manage all your reservations</p>
        </div>

        {/* Booking History Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Card Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Booking History</h2>
            <p className="text-gray-500 text-sm mt-1">{bookings.length} total bookings</p>
          </div>

          {/* Table */}
          {bookings.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <p className="text-gray-500 text-lg">No bookings found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Movie</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Cinema</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Show Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Show Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Seats</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Booked On</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      {/* Movie */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {booking.showId?.movieId?.title || "N/A"}
                        </span>
                      </td>

                      {/* Cinema */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {booking.showId?.cinemaId?.name || "N/A"}
                        </span>
                      </td>

                      {/* Show Date */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {booking.showId?.showDate
                            ? new Date(booking.showId.showDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })
                            : "N/A"}
                        </span>
                      </td>

                      {/* Show Time */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {booking.showId?.time || "N/A"}
                        </span>
                      </td>

                      {/* Seats */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {booking.seatIds?.length > 0
                            ? booking.seatIds.map((seat) => seat.seatNumber).join(", ")
                            : "N/A"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          Rs. {booking.totalAmount}
                        </span>
                      </td>

                      {/* Booked On */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {formatDateTime(booking.createdAt)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            booking.bookingStatus === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.bookingStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
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
        </div>

        {/* Back to Home */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;