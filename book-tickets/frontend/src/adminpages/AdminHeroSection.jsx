import React, { useState, useEffect } from "react";
import { Plus, AlertTriangle, AlertCircle, CheckCircle, X } from "lucide-react";
import axios from "axios";
import HeroSlideForm from "../components/AdminHeroForm";
import HeroSlideCard from "../components/AdminHeroSlideCard";

export default function AdminHeroSection() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
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
      showToast("Failed to load hero slides", "error");
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
      showToast("Hero slide deleted successfully", "success");
      fetchHeroes();
    } catch (error) {
      console.error("Error deleting hero slide:", error);
      showToast(error.response?.data?.message || "Failed to delete hero slide", "error");
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
        showToast(
          `Hero slide ${!slide.isActive ? "activated" : "deactivated"} successfully`,
          "success"
        );
        fetchHeroes();
      }
    } catch (error) {
      console.error("Error toggling hero slide status:", error);
      showToast(error.response?.data?.message || "Failed to update hero slide", "error");
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
          showToast("Hero slide edited successfully", "success");
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
          showToast("Hero slide added successfully", "success");
          setShowForm(false);
          setEditingSlide(null);
          fetchHeroes();
        }
      }
    } catch (error) {
      console.error("Error saving hero slide:", error);
      showToast(error.response?.data?.message || "Failed to save hero slide", "error");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlide(null);
  };

  return (
    <div className="space-y-6 border border-red-300 rounded-lg p-6">
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