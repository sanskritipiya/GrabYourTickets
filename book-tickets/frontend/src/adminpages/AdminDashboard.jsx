import React, { useEffect, useState } from "react"
import { Calendar, Users, Film, Building2, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalCinemas: 0,
    totalShows: 0,
    totalSeats: 0,
  })
  const [bookings, setBookings] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token")

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [moviesRes, cinemasRes, showsRes, seatsRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:3000/api/movies", { headers }),
          fetch("http://localhost:3000/api/cinemas", { headers }),
          fetch("http://localhost:3000/api/shows", { headers }),
          fetch("http://localhost:3000/api/seats", { headers }),
          fetch("http://localhost:3000/api/bookings/all", { headers }),
        ])

        const moviesData = await moviesRes.json()
        const cinemasData = await cinemasRes.json()
        const showsData = await showsRes.json()
        const seatsData = await seatsRes.json()
        const bookingsData = await bookingsRes.json()

        // Handle different API response shapes safely
        const movies = moviesData.data || moviesData.movies || []
        const cinemas = cinemasData.data || cinemasData.cinemas || []
        const shows = showsData.data || showsData.shows || []
        const seats = seatsData.data || seatsData.seats || []
        const bookingsArray = bookingsData.data || bookingsData || []

        setStats({
          totalMovies: movies.length,
          totalCinemas: cinemas.length,
          totalShows: shows.length,
          totalSeats: seats.length,
        })

        // Format bookings for table
        const formattedBookings = bookingsArray
          .map((b) => ({
            id: b._id,
            bookingId: b._id.slice(-6).toUpperCase(),
            userName: b.userId?.name || "N/A",
            movie: b.showId?.movieId?.title || "N/A",
            seats: Array.isArray(b.seatIds) ? b.seatIds.map((s) => s.seatNumber).join(", ") : "N/A",
            total: b.totalAmount || 0,
            status: b.bookingStatus || "PENDING",
            date: b.createdAt || b.bookingDate || new Date(),
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5) // Get latest 5 bookings

        setBookings(formattedBookings)

        // Prepare chart data - bookings per day for last 7 days
        const last7Days = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          last7Days.push({
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'long' })
          })
        }

        const bookingsByDay = last7Days.map(({ date, day }) => {
          const count = bookingsArray.filter((b) => {
            const bookingDate = new Date(b.createdAt || b.bookingDate)
            return bookingDate.toISOString().split('T')[0] === date
          }).length

          return {
            day,
            bookings: count,
          }
        })

        setChartData(bookingsByDay)
        setLoading(false)
      } catch (error) {
        console.error("Dashboard data error:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 p-6 bg-red-50 min-h-screen">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-red-900">Dashboard</h2>
        <p className="text-red-700">Welcome to your admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Movies */}
        <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-red-800">Movies</h3>
            <Film className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-700 mt-2">
            {stats.totalMovies}
          </div>
        </div>

        {/* Cinemas */}
        <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-red-800">Cinemas</h3>
            <Building2 className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-700 mt-2">
            {stats.totalCinemas}
          </div>
        </div>

        {/* Shows */}
        <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-red-800">Shows</h3>
            <Calendar className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-700 mt-2">
            {stats.totalShows}
          </div>
        </div>

        {/* Seats */}
        <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-red-800">Seats</h3>
            <Users className="text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-700 mt-2">
            {stats.totalSeats}
          </div>
        </div>
      </div>

      {/* Booking Trends Chart */}
      <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-red-500" />
          <h3 className="text-lg font-semibold text-red-900">Daily Booking Trends (Last 7 Days)</h3>
        </div>
        
        {loading ? (
          <div className="h-80 flex items-center justify-center text-red-500">
            Loading chart data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fee2e2" />
              <XAxis 
                dataKey="day" 
                stroke="#991b1b"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#991b1b"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #fecaca',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#dc2626" 
                strokeWidth={3}
                name="Total Bookings"
                dot={{ fill: '#dc2626', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Latest Bookings Table */}
      <div className="bg-white border border-red-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-red-200">
          <h3 className="text-lg font-semibold text-red-900">Latest Bookings</h3>
        </div>
        <div className="p-6">
          {loading ? (
            <p className="text-center text-red-500 py-8">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-center text-red-400 py-8">No bookings found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-800">Booking ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-800">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-800">Movie</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-800">Seats</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-800">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-red-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-red-100 hover:bg-red-50">
                      <td className="px-4 py-3 text-sm font-medium text-red-600">
                        {booking.bookingId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {booking.userName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {booking.movie}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {booking.seats}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">
                        Rs. {booking.total}
                      </td>
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
          )}
        </div>
      </div>
    </div>
  )
}