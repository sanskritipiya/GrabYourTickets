import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function SeatsShowsPage() {
  const [shows, setShows] = useState([
    { id: 1, movie: "Inception", hall: "Hall 1", date: "2024-12-18", time: "14:00", totalSeats: 150, bookedSeats: 89 },
    { id: 2, movie: "The Dark Knight", hall: "Hall 2", date: "2024-12-18", time: "16:30", totalSeats: 200, bookedSeats: 145 },
    { id: 3, movie: "Interstellar", hall: "Hall 3", date: "2024-12-18", time: "19:00", totalSeats: 180, bookedSeats: 120 },
    { id: 4, movie: "Avatar", hall: "Hall 1", date: "2024-12-19", time: "15:00", totalSeats: 150, bookedSeats: 67 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movie: "",
    hall: "",
    date: "",
    time: "",
    totalSeats: "",
    bookedSeats: 0,
  });

  const handleAdd = () => {
    setEditingShow(null);
    setFormData({ movie: "", hall: "", date: "", time: "", totalSeats: "", bookedSeats: 0 });
    setShowForm(true);
  };

  const handleEdit = (show) => {
    setEditingShow(show);
    setFormData({ ...show });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setShows(shows.filter((s) => s.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingShow) {
      setShows(shows.map((s) => (s.id === editingShow.id ? { ...formData, id: s.id } : s)));
    } else {
      setShows([...shows, { ...formData, id: Date.now() }]);
    }
    setShowForm(false);
    setFormData({ movie: "", hall: "", date: "", time: "", totalSeats: "", bookedSeats: 0 });
  };

  const getOccupancyColor = (booked, total) => {
    const percentage = (booked / total) * 100;
    if (percentage >= 80) return "text-red-700";
    if (percentage >= 50) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Seats & Shows Management</h2>
          <p className="text-gray-600">Manage movie shows and seat availability</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Show
        </button>
      </div>

      {/* Form + Shows Table */}
      <>
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-red-400 shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{editingShow ? "Edit Show" : "Add New Show"}</h3>
                <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {["movie", "hall", "date", "time", "totalSeats", "bookedSeats"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      {field === "date" ? (
                        <input
                          type="date"
                          value={formData[field]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                          required
                        />
                      ) : (
                        <input
                          type={field === "time" ? "time" : "number"}
                          value={formData[field]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field]:
                                field === "totalSeats" || field === "bookedSeats" ? Number(e.target.value) : e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                  >
                    {editingShow ? "Update Show" : "Add Show"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
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
                    <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => {
                  const occupancy = ((show.bookedSeats / show.totalSeats) * 100).toFixed(0);
                  return (
                    <tr key={show.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{show.movie}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{show.hall}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{show.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{show.time}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {show.bookedSeats} / {show.totalSeats}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold ${getOccupancyColor(show.bookedSeats, show.totalSeats)}`}>
                        {occupancy}%
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(show)}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(show.id)}
                            className="px-3 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>
    </div>
  );
}
