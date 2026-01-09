import React, { useState } from "react";
import { X, Upload } from "lucide-react";

export default function MovieForm({ movie, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    genre: movie?.genre || "",
    duration: movie?.duration || "",
    language: movie?.language || "",
    description: movie?.description || "",
    releaseDate: movie?.releaseDate || "",
    trailer: movie?.trailer || movie?.trailerUrl || "",
    isNewRelease: movie?.isNewRelease || false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(movie?.image || "");

  // ✅ IMAGE UPLOAD (MEMORY STORAGE FRIENDLY)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ✅ SUBMIT USING FormData (FIXED)
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("title", formData.title);
    data.append("genre", formData.genre);
    data.append("language", formData.language);
    data.append("duration", formData.duration);
    data.append("releaseDate", formData.releaseDate);
    data.append("description", formData.description);
    data.append("trailer", formData.trailer || "");

    // 🔥 IMPORTANT FIX: send boolean as STRING
    data.append("isNewRelease", String(formData.isNewRelease));

    // ✅ Image required only when ADDING or changed
    if (imageFile) {
      data.append("image", imageFile);
    }

    onSubmit(data);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-red-600 shadow-sm">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {movie ? "Edit Movie" : "Add New Movie"}
        </h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Genre *
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) =>
                  setFormData({ ...formData, genre: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Language *
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Duration (minutes) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Release Date *
              </label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, releaseDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={formData.isNewRelease}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isNewRelease: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-red-600"
                />
                <label className="text-sm text-gray-700">
                  Mark as New Release
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Trailer URL
            </label>
            <input
              type="url"
              value={formData.trailer}
              onChange={(e) =>
                setFormData({ ...formData, trailer: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Movie Poster {movie ? "" : "*"}
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              {movie ? "Update Movie" : "Add Movie"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
