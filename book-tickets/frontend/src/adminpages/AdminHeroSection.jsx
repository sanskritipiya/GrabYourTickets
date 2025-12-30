import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeroSlideForm from "../components/AdminHeroForm";
import HeroSlideCard from "../components/AdminHeroSlideCard";

export default function AdminHeroSection() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  const fetchHeroes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/heroes");
      console.log("Fetched hero slides:", response);
      if (response.data.success) {
        setHeroSlides(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching heroes:", error);
      toast.error("Failed to load hero slides");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleAdd = () => {
    setEditingSlide(null);
    setShowForm(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero slide?")) return;

    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:3000/api/heroes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Hero slide deleted successfully");
      fetchHeroes();
    } catch (error) {
      console.error("Error deleting hero slide:", error);
      toast.error(error.response?.data?.message || "Failed to delete hero slide");
    }
  };

  const handleToggleActive = async (slide) => {
    try {
      const token = getAuthToken();

      const response = await axios.put(
        `http://localhost:3000/api/heroes/${slide._id || slide.id}`,
        { isActive: !slide.isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          `Hero slide ${!slide.isActive ? "activated" : "deactivated"} successfully`
        );
        fetchHeroes();
      }
    } catch (error) {
      console.error("Error toggling hero slide status:", error);
      toast.error(error.response?.data?.message || "Failed to update hero slide");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = getAuthToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (editingSlide) {
        const slideId = editingSlide._id || editingSlide.id;

        const response = await axios.put(
          `http://localhost:3000/api/heroes/${slideId}`,
          formData,
          { headers }
        );

        if (response.data.success) {
          toast.success("Hero slide edited successfully");
          setShowForm(false);
          setEditingSlide(null);
          fetchHeroes();
        }
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/heroes",
          formData,
          { headers }
        );

        if (response.data.success) {
          toast.success("Hero slide added successfully");
          setShowForm(false);
          setEditingSlide(null);
          fetchHeroes();
        }
      }
    } catch (error) {
      console.error("Error saving hero slide:", error);
      toast.error(error.response?.data?.message || "Failed to save hero slide");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlide(null);
  };

  return (
    <div className="space-y-6 border border-red-300 rounded-lg p-6">
      <div className="flex items-center justify-between border-b border-red-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Manage Hero Section
          </h2>
          <p className="text-gray-600">
            Manage homepage hero carousel slides
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={1500} />

      {showForm && (
        <HeroSlideForm
          slide={editingSlide}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading hero slides...</p>
        </div>
      ) : heroSlides.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No hero slides found. Add your first slide!
          </p>
        </div>
      ) : (
        <div className="space-y-4 border border-red-200 rounded-lg p-4">
          {heroSlides.map((slide) => (
            <HeroSlideCard
              key={slide._id || slide.id}
              slide={slide}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}