import React from "react"
import { Edit, Trash2 } from "lucide-react"

export default function HeroSlideCard({ slide, onEdit, onDelete, onToggleActive }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3">
          <img
            src={slide.backgroundImage || "/placeholder.png"}
            alt={slide.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={() => onToggleActive(slide)}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                slide.isActive
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}
            >
              {slide.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{slide.title}</h3>
              <p className="text-gray-600 mb-4">{slide.subtitle}</p>
              {slide.description && (
                <p className="text-sm text-gray-500 mb-4">{slide.description}</p>
              )}
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                {slide.ctaText || slide.cta || "Learn More"}
              </button>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(slide)}
                className="p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(slide._id || slide.id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
