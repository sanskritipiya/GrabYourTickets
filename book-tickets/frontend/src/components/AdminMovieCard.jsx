import React from "react";
import { Edit, Trash2, Play } from "lucide-react";

export default function MovieCard({ movie, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={movie.image || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
        {(movie.trailer || movie.trailerUrl) && (
          <a
            href={movie.trailer || movie.trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Play className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900">{movie.title}</h3>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>Genre: {movie.genre}</p>
          <p>Language: {movie.language}</p>
          <p>Duration: {movie.duration}</p>
          <p>Release: {movie.releaseDate}</p>
          <p>
            Rating: <span className="text-red-600 font-semibold">{movie.rating}</span>
          </p>
        </div>

        {movie.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{movie.description}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(movie)}
            className="flex-1 flex items-center justify-center px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(movie._id || movie.id)}
            className="flex-1 flex items-center justify-center px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
