import React, { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, Users, Film, Building2 } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalCinemas: 0,
    totalShows: 0,
    totalSeats: 0,
  })

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token")

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [moviesRes, cinemasRes, showsRes, seatsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/movies", { headers }),
          axios.get("http://localhost:3000/api/cinemas", { headers }),
          axios.get("http://localhost:3000/api/shows", { headers }),
          axios.get("http://localhost:3000/api/seats", { headers }),
        ])

        // 🔴 Handle different API response shapes safely
        const movies = moviesRes.data.data || moviesRes.data.movies || []
        const cinemas = cinemasRes.data.data || cinemasRes.data.cinemas || []
        const shows = showsRes.data.data || showsRes.data.shows || []
        const seats = seatsRes.data.data || seatsRes.data.seats || []

        setStats({
          totalMovies: movies.length,
          totalCinemas: cinemas.length,
          totalShows: shows.length,
          totalSeats: seats.length,
        })
      } catch (error) {
        console.error("Dashboard stats error:", error)
      }
    }

    fetchDashboardStats()
  }, [])

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
    </div>
  )
}