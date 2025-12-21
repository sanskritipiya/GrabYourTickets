import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SeatsShowsPage() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movieId: "",
    hall: "",
    date: "",
    time: "",
    totalSeats: "",
    bookedSeats: 0,
  });

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Fetch movies
  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/movies");
      if (response.data.success) {
        setMovies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to load movies");
    }
  };

  // Fetch shows
  const fetchShows = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/shows");
      if (response.data.success) {
        setShows(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
      toast.error("Failed to load shows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchShows();
  }, []);

  // Add show button
  const handleAdd = () => {
    setEditingShow(null);
    setFormData({ movieId: "", hall: "", date: "", time: "", totalSeats: "", bookedSeats: 0 });
    setShowForm(true);
  };

  // Edit show
  const handleEdit = (show) => {
    setEditingShow(show);
    setFormData({
      movieId: show.movieId._id || show.movieId,
      hall: show.hall,
      date: show.date,
      time: show.time,
      totalSeats: show.totalSeats,
      bookedSeats: show.bookedSeats || 0,
    });
    setShowForm(true);
  };

  // Cancel form
  const handleCancel = () => {
    setShowForm(false);
    setEditingShow(null);
    setFormData({ movieId: "", hall: "", date: "", time: "", totalSeats: "", bookedSeats: 0 });
  };

  // Delete show
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;

    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:3000/api/shows/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Show deleted successfully");
      fetchShows();
    } catch (error) {
      console.error("Error deleting show:", error);
      toast.error(error.response?.data?.message || "Failed to delete show");
    }
  };

  // Submit add/edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

      const submitData = {
        movieId: formData.movieId,
        hall: formData.hall,
        date: formData.date,
        time: formData.time,
        totalSeats: Number(formData.totalSeats),
        bookedSeats: Number(formData.bookedSeats) || 0,
      };

      if (editingShow && (editingShow._id || editingShow.id)) {
        const showId = editingShow._id || editingShow.id;
        const response = await axios.put(`http://localhost:3000/api/shows/${showId}`, submitData, { headers });
        if (response.data.success) {
          toast.success("Show edited successfully");
          handleCancel(); // hide form
          fetchShows();
        }
      } else {
        const response = await axios.post("http://localhost:3000/api/shows", submitData, { headers });
        if (response.data.success) {
          toast.success("Show added successfully");
          handleCancel(); // hide form
          fetchShows();
        }
      }
    } catch (error) {
      console.error("Error saving show:", error);
      toast.error(error.response?.data?.message || "Failed to save show");
    }
  };

  const getOccupancyColor = (booked, total) => {
    const percentage = (booked / total) * 100;
    if (percentage >= 80) return "text-red-700";
    if (percentage >= 50) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-center" autoClose={1500} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Seats & Shows Management</h2>
          <p className="text-gray-600">Manage movie shows and seat availability</p>
        </div>
        <button onClick={handleAdd} className="inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Show
        </button>
      </div>

      {/* Form + Shows Table */}
      <>
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-red-400 shadow-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editingShow ? "Edit Show" : "Add New Show"}</h3>
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Movie */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Movie *</label>
                    <select
                      value={formData.movieId}
                      onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    >
                      <option value="">Select a movie</option>
                      {movies.map((movie) => (
                        <option key={movie._id} value={movie._id}>{movie.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Hall */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Hall *</label>
                    <input
                      type="text"
                      value={formData.hall}
                      onChange={(e) => setFormData({ ...formData, hall: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Time *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>

                  {/* Total Seats */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Total Seats *</label>
                    <input
                      type="number"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                      min="1"
                    />
                  </div>

                  {/* Booked Seats */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Booked Seats</label>
                    <input
                      type="number"
                      value={formData.bookedSeats}
                      onChange={(e) => setFormData({ ...formData, bookedSeats: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors">
                    {editingShow ? "Update Show" : "Add Show"}
                  </button>
                  <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Shows Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {["Movie", "Hall", "Date", "Time", "Seats", "Occupancy", "Actions"].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-700">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-600">Loading shows...</td>
                  </tr>
                ) : shows.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-600">No shows found. Add your first show!</td>
                  </tr>
                ) : (
                  shows.map((show) => {
                    const occupancy = ((show.bookedSeats / show.totalSeats) * 100).toFixed(0);
                    const movieTitle = show.movieId?.title || show.movie || "N/A";
                    return (
                      <tr key={show._id || show.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{movieTitle}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{show.hall}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{show.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{show.time}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{show.bookedSeats} / {show.totalSeats}</td>
                        <td className={`px-4 py-3 text-sm font-semibold ${getOccupancyColor(show.bookedSeats, show.totalSeats)}`}>{occupancy}%</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(show)} className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDelete(show._id || show.id)} className="px-3 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-800 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    </div>
  );
}
