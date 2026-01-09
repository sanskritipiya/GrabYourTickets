import React, { useState, useEffect } from "react";
import { Plus, AlertTriangle, AlertCircle, CheckCircle, X } from "lucide-react";
import axios from "axios";
import MovieForm from "../components/AdminMovieForm";
import MovieCard from "../components/AdminMovieCard";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [toast, setToast] = useState(null);

  // Custom Toast Function
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getToastStyles = () => {
    switch (toast?.type) {
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          text: "text-yellow-800",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          text: "text-red-800",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          text: "text-green-800",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
          text: "text-blue-800",
        };
    }
  };

  const getAuthToken = () =>
    localStorage.getItem("authToken") || localStorage.getItem("token");

  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/movies");
      if (res.data.success) setMovies(res.data.data);
    } catch {
      showToast("Failed to load movies", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const token = getAuthToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (editingMovie) {
        await axios.put(
          `http://localhost:3000/api/movies/${editingMovie._id}`,
          formData,
          { headers }
        );
        showToast("Movie updated successfully", "success");
      } else {
        await axios.post(
          "http://localhost:3000/api/movies",
          formData,
          { headers }
        );
        showToast("Movie added successfully", "success");
      }

      setShowForm(false);
      fetchMovies();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to save movie", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;

    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:3000/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Movie deleted successfully", "success");
      fetchMovies();
    } catch {
      showToast("Failed to delete movie", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Custom Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div
            className={`${getToastStyles().bg} ${getToastStyles().border} border rounded-lg px-6 py-4 shadow-lg min-w-[400px] max-w-[500px]`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{getToastStyles().icon}</div>
              <p className={`${getToastStyles().text} font-medium flex-1`}>{toast.message}</p>
              <button
                onClick={() => setToast(null)}
                className={`flex-shrink-0 ${getToastStyles().text} opacity-40 hover:opacity-100 transition-opacity`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Manage Movies</h2>
        <button
          onClick={() => {
            setEditingMovie(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Movie
        </button>
      </div>

      {showForm && (
        <MovieForm
          movie={editingMovie}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <p>Loading movies...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onEdit={(m) => {
                setEditingMovie(m);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}