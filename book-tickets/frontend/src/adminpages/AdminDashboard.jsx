import React, { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,} from "recharts"
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const [stats] = useState({
    totalBookings: 1245,
    totalRevenue: 52430,
    totalSeats: 3500,
    occupancyRate: 68,
  })

  const [recentBookings] = useState([
    { id: 1, userName: "John Doe", movie: "Inception", seats: 3, total: 45, date: "2024-12-17 14:30" },
    { id: 2, userName: "Sarah Smith", movie: "The Dark Knight", seats: 2, total: 30, date: "2024-12-17 13:15" },
    { id: 3, userName: "Mike Johnson", movie: "Interstellar", seats: 4, total: 60, date: "2024-12-17 12:00" },
    { id: 4, userName: "Emily Brown", movie: "Avatar", seats: 2, total: 30, date: "2024-12-17 11:45" },
    { id: 5, userName: "David Wilson", movie: "The Matrix", seats: 5, total: 75, date: "2024-12-17 10:30" },
  ])

  const bookingData = [
    { day: "Mon", bookings: 45, revenue: 1350 },
    { day: "Tue", bookings: 52, revenue: 1560 },
    { day: "Wed", bookings: 38, revenue: 1140 },
    { day: "Thu", bookings: 65, revenue: 1950 },
    { day: "Fri", bookings: 89, revenue: 2670 },
    { day: "Sat", bookings: 125, revenue: 3750 },
    { day: "Sun", bookings: 98, revenue: 2940 },
  ]

  const moviePerformance = [
    { movie: "Inception", seats: 450 },
    { movie: "Interstellar", seats: 380 },
    { movie: "The Dark Knight", seats: 520 },
    { movie: "Avatar", seats: 390 },
    { movie: "The Matrix", seats: 290 },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome to your admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium">Total Bookings</h3>
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-red-600">{stats.totalBookings}</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium">Revenue</h3>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-red-600">${stats.totalRevenue}</div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium">Total Seats</h3>
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-red-600">{stats.totalSeats}</div>
            <p className="text-xs text-gray-500">Across all halls</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-row items-center justify-between p-6 pb-2">
            <h3 className="text-sm font-medium">Occupancy Rate</h3>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-red-600">{stats.occupancyRate}%</div>
            <p className="text-xs text-gray-500">+5% from last week</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Bookings Line Chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Weekly Bookings</h3>
            <p className="text-sm text-gray-500">Bookings and revenue for the past week</p>
          </div>
          <div className="p-6 pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Movie Performance Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Movie Performance</h3>
            <p className="text-sm text-gray-500">Total seats booked by movie</p>
          </div>
          <div className="p-6 pt-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moviePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="movie" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="seats" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Bookings Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold">Latest Bookings</h3>
          <p className="text-sm text-gray-500">Most recent customer bookings</p>
        </div>
        <div className="p-6 pt-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Movie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Seats</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-900">{booking.userName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{booking.movie}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{booking.seats}</td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">${booking.total}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{booking.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
