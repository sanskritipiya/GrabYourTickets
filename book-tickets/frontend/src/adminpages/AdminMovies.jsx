import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MovieForm from "../components/AdminMovieForm";
import MovieCard from "../components/AdminMovieCard";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Fetch all movies
  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/movies");
      if (response.data.success) {
        setMovies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Add movie handler
  const handleAdd = () => {
    setEditingMovie(null);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      const token = getAuthToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (editingMovie) {
        // Update existing movie using PUT http://localhost:3000/api/movies/:id
        const movieId = editingMovie._id || editingMovie.id;
        const response = await axios.put(
          `http://localhost:3000/api/movies/${movieId}`,
          formData,
          { headers }
        );
        if (response.data.success) {
          toast.success("Movie edited successfully");
          setShowForm(false);
          fetchMovies(); // Refresh the list
        }
      } else {
        // Add new movie using POST http://localhost:3000/api/movies
        const response = await axios.post(
          "http://localhost:3000/api/movies",
          formData,
          { headers }
        );
        if (response.data.success) {
          toast.success("Movie added successfully");
          setShowForm(false);
          fetchMovies(); // Refresh the list
        }
      }
    } catch (error) {
      console.error("Error saving movie:", error);
      toast.error(error.response?.data?.message || "Failed to save movie");
    }
  };

  // Edit movie handler
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowForm(true);
  };

  // Delete movie handler using DELETE http://localhost:3000/api/movies/:id
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:3000/api/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Movie deleted successfully");
      fetchMovies(); // Refresh the list
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error(error.response?.data?.message || "Failed to delete movie");
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Manage Movies
          </h2>
          <p className="text-gray-600">Add, edit, or remove movies from your catalog</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
        <div className="text-center py-8">
          <p className="text-gray-600">Loading movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No movies found. Add your first movie!</p>
        </div>
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard
              key={movie._id || movie.id}
            movie={movie}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      )}
    </div>
  );
}
