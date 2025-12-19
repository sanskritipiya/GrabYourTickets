import React, { useState } from "react";
import { Plus } from "lucide-react";
import HeroSlideForm from "../components/AdminHeroForm";
import HeroSlideCard from "../components/AdminHeroSlideCard";


export default function AdminHeroSection() {
  const [heroSlides, setHeroSlides] = useState([
    {
      id: 1,
      title: "Now Showing: Inception",
      subtitle: "Experience the dream within a dream",
      image: "/placeholder.svg?height=400&width=1200",
      cta: "Book Now",
      isActive: true,
    },
    {
      id: 2,
      title: "Coming Soon: Avatar 3",
      subtitle: "The journey continues",
      image: "/placeholder.svg?height=400&width=1200",
      cta: "Get Notified",
      isActive: true,
    },
    {
      id: 3,
      title: "Special Offer: 20% Off",
      subtitle: "Book 4 tickets and get 20% discount",
      image: "/placeholder.svg?height=400&width=1200",
      cta: "Claim Offer",
      isActive: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const handleAdd = () => {
    setEditingSlide(null);
    setShowForm(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setHeroSlides(heroSlides.filter((s) => s.id !== id));
  };

  const handleToggleActive = (id) => {
    setHeroSlides(
      heroSlides.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const handleSubmit = (formData) => {
    if (editingSlide) {
      setHeroSlides(
        heroSlides.map((s) =>
          s.id === editingSlide.id ? { ...formData, id: s.id } : s
        )
      );
    } else {
      setHeroSlides([...heroSlides, { ...formData, id: Date.now() }]);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
              onCancel={() => setShowForm(false)}
            />
      )}

      <div className="space-y-4">
        {heroSlides.map((slide) => (
          <HeroSlideCard
            key={slide.id}
            slide={slide}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>
    </div>
  );
}
