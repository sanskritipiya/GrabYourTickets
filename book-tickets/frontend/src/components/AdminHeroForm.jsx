import React, { useState } from "react";
import { X } from "lucide-react";

export default function HeroSlideForm({ slide, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    image: slide?.image || "",
    cta: slide?.cta || "",
    isActive: slide?.isActive !== undefined ? slide.isActive : true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg border border-red-400 shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{slide ? "Edit Hero Slide" : "Add New Hero Slide"}</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
              placeholder="Enter slide title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
              placeholder="Enter subtitle"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
              placeholder="https://..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Call to Action
            </label>
            <input
              type="text"
              value={formData.cta}
              onChange={(e) =>
                setFormData({ ...formData, cta: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
              placeholder="Book Now"
              required
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 text-red-700 border-gray-300 rounded focus:ring-red-600"
              />
              <span className="text-sm font-semibold text-gray-800">
                Active (Show on homepage)
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
            >
              {slide ? "Update Slide" : "Add Slide"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
