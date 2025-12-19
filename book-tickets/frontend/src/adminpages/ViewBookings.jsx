import React, { useState } from "react";
import { Search, Download } from "lucide-react";

export default function ViewBookings() {
  const [bookings] = useState([
    {
      id: 1,
      bookingId: "BK001",
      userName: "John Doe",
      email: "john@example.com",
      movie: "Inception",
      show: "2024-12-18 14:00",
      hall: "Hall 1",
      seats: "A1, A2, A3",
      total: 45,
      status: "Confirmed",
    },
    {
      id: 2,
      bookingId: "BK002",
      userName: "Sarah Smith",
      email: "sarah@example.com",
      movie: "The Dark Knight",
      show: "2024-12-18 16:30",
      hall: "Hall 2",
      seats: "B5, B6",
      total: 30,
      status: "Confirmed",
    },
    {
      id: 3,
      bookingId: "BK003",
      userName: "Mike Johnson",
      email: "mike@example.com",
      movie: "Interstellar",
      show: "2024-12-18 19:00",
      hall: "Hall 3",
      seats: "C1, C2, C3, C4",
      total: 60,
      status: "Confirmed",
    },
    {
      id: 4,
      bookingId: "BK004",
      userName: "Emily Brown",
      email: "emily@example.com",
      movie: "Avatar",
      show: "2024-12-19 15:00",
      hall: "Hall 1",
      seats: "D10, D11",
      total: 30,
      status: "Pending",
    },
    {
      id: 5,
      bookingId: "BK005",
      userName: "David Wilson",
      email: "david@example.com",
      movie: "The Matrix",
      show: "2024-12-19 18:00",
      hall: "Hall 2",
      seats: "E1, E2, E3, E4, E5",
      total: 75,
      status: "Confirmed",
    },
    {
      id: 6,
      bookingId: "BK006",
      userName: "Lisa Anderson",
      email: "lisa@example.com",
      movie: "Inception",
      show: "2024-12-20 14:00",
      hall: "Hall 1",
      seats: "F5, F6",
      total: 30,
      status: "Cancelled",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.movie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExport = () => {
    console.log("Exporting bookings...");
    alert("Booking data exported successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">User Bookings</h2>
          <p className="text-gray-600">View and manage all customer bookings</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Search Bookings</h3>
        </div>
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">All Bookings ({filteredBookings.length})</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Booking ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Movie</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Show Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hall</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Seats</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-red-600">{booking.bookingId}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{booking.userName}</div>
                        <div className="text-gray-500 text-xs">{booking.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{booking.movie}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{booking.show}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{booking.hall}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{booking.seats}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">${booking.total}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
