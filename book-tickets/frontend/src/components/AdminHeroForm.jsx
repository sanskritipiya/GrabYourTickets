import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import axios from "axios";

export default function HeroSlideForm({ slide, onSubmit, onCancel }) {
  const [title, setTitle] = useState(slide?.title || "");
  const [subtitle, setSubtitle] = useState(slide?.subtitle || "");
  const [description, setDescription] = useState(slide?.description || "");
  const [ctaText, setCtaText] = useState(slide?.ctaText || "Learn More");
  const [ctaLink, setCtaLink] = useState(slide?.ctaLink || "#");
  const [isActive, setIsActive] = useState(
    slide?.isActive !== undefined ? slide.isActive : true
  );

  // 🔥 DYNAMIC movieId (NO UI)
  const [movieId, setMovieId] = useState(slide?.movieId || "");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    slide?.backgroundImage || ""
  );

  // 🔥 FETCH A MOVIE ONLY FOR LOGIC (NO UI)
  useEffect(() => {
    if (movieId) return; // already have movieId (edit case)

    const fetchMovieId = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/movies");
        if (res.data.success && res.data.data.length > 0) {
          setMovieId(res.data.data[0]._id); // ✅ dynamic
        }
      } catch (err) {
        console.error("Failed to fetch movieId", err);
      }
    };

    fetchMovieId();
  }, [movieId]);

  // IMAGE HANDLER
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!movieId) {
      alert("Movie not loaded yet. Please wait a moment.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("description", description);
    formData.append("ctaText", ctaText);
    formData.append("ctaLink", ctaLink);
    formData.append("isActive", isActive);

    // 🔥 REQUIRED BY BACKEND
    formData.append("movieId", movieId);

    if (imageFile) {
      formData.append("backgroundImage", imageFile);
    }

    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg border border-red-300 shadow-md">
      <div className="p-6 border-b border-red-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {slide ? "Edit Hero Slide" : "Add New Hero Slide"}
          </h3>
          <button onClick={onCancel} className="hover:bg-red-50 rounded p-1">
            <X />
          </button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TITLE */}
          <p className="text-sm font-medium text-gray-700">Title</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full border border-red-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          {/* SUBTITLE */}
          <p className="text-sm font-medium text-gray-700">Subtitle</p>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle"
            className="w-full border border-red-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          {/* DESCRIPTION */}
          <p className="text-sm font-medium text-gray-700">Description</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border border-red-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          {/* BACKGROUND IMAGE */}
          <p className="text-sm font-medium text-gray-700">Background Image</p>
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-red-200 cursor-pointer rounded hover:bg-red-50 transition">
            <Upload className="text-red-400" />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="preview"
              className="h-32 object-cover rounded border border-red-200"
            />
          )}

          {/* CTA TEXT */}
          <p className="text-sm font-medium text-gray-700">CTA Text</p>
          <input
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="CTA Text"
            className="w-full border border-red-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          {/* CTA LINK */}
          <p className="text-sm font-medium text-gray-700">CTA Link</p>
          <input
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            placeholder="CTA Link"
            className="w-full border border-red-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />

          {/* ACTIVE */}
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="accent-red-600"
            />
            Active
          </label>

          <div className="flex gap-3">
            <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">
              {slide ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="border border-red-200 px-4 py-2 rounded hover:bg-red-50"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}