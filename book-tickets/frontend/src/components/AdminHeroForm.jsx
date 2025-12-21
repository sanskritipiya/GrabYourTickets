import React, { useState } from "react";
import { X, Upload } from "lucide-react";

export default function HeroSlideForm({ slide, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    description: slide?.description || "",
    backgroundImage: slide?.backgroundImage || "",
    ctaText: slide?.ctaText || "Learn More",
    ctaLink: slide?.ctaLink || "#",
    isActive: slide?.isActive !== undefined ? slide.isActive : true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(slide?.backgroundImage || "");

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, backgroundImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
              placeholder="Enter description"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Background Image
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              {imagePreview && (
                <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Call to Action Text
            </label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) =>
                setFormData({ ...formData, ctaText: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
              placeholder="Learn More"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Call to Action Link
            </label>
            <input
              type="text"
              value={formData.ctaLink}
              onChange={(e) =>
                setFormData({ ...formData, ctaLink: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
              placeholder="#"
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
