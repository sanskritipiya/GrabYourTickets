import React, { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import axios from "axios";

export default function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH ALL BOOKINGS (ADMIN) =================
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        // ✅ YOUR BACKEND API (UNCHANGED)
        const res = await axios.get(
          "http://localhost:3000/api/bookings/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bookingsData = res.data?.data || [];

        const formattedBookings = bookingsData.map((b) => ({
          id: b._id, // 🔥 REAL MongoDB ID
          bookingId: b._id.slice(-6).toUpperCase(), // UI DISPLAY ONLY
          userName: b.userId?.name || "N/A",
          email: b.userId?.email || "N/A",
          movie: b.showId?.movieId?.title || "N/A",
          show: `${b.showId?.showDate || "N/A"} ${b.showId?.time || ""}`.trim(),
          hall: b.showId?.cinemaId?.name || "N/A",
          seats: Array.isArray(b.seatIds)
            ? b.seatIds.map((s) => s.seatNumber).join(", ")
            : "N/A",
          total: b.totalAmount || 0,
          status: b.bookingStatus || "PENDING",
        }));

        setBookings(formattedBookings);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);

        if (error.response?.status === 403) {
          setError("Access denied. Admin privileges required.");
        } else if (error.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
        } else {
          setError(error.response?.data?.message || "Failed to load bookings");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ================= DELETE BOOKING (ADMIN FORCE DELETE) =================
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const token = localStorage.getItem("token");

      // 🔥 ONLY CHANGE IS HERE (FORCE DELETE API)
      await axios.delete(
        `http://localhost:3000/api/bookings/admin/force/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from UI instantly
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Failed to delete booking");
    }
  };

  // ================= SEARCH FILTER =================
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.movie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ================= UI STATES =================
  if (loading) {
    return (
      <p className="text-center text-gray-500 py-8">
        Loading bookings...
      </p>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          User Bookings
        </h2>
        <p className="text-gray-600">
          View and manage all customer bookings
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by booking ID, user name, email, or movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm">Booking ID</th>
                <th className="px-4 py-3 text-left text-sm">User</th>
                <th className="px-4 py-3 text-left text-sm">Movie</th>
                <th className="px-4 py-3 text-left text-sm">Show Time</th>
                <th className="px-4 py-3 text-left text-sm">Hall</th>
                <th className="px-4 py-3 text-left text-sm">Seats</th>
                <th className="px-4 py-3 text-left text-sm">Total</th>
                <th className="px-4 py-3 text-left text-sm">Status</th>
                <th className="px-4 py-3 text-left text-sm">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-red-600">
                      {booking.bookingId}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{booking.userName}</div>
                      <div className="text-xs text-gray-500">
                        {booking.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">{booking.movie}</td>
                    <td className="px-4 py-3">{booking.show}</td>
                    <td className="px-4 py-3">{booking.hall}</td>
                    <td className="px-4 py-3">{booking.seats}</td>
                    <td className="px-4 py-3 font-semibold text-red-600">
                      Rs. {booking.total}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(booking.userName === "N/A" ||
                        booking.status === "CANCELLED") && (
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
