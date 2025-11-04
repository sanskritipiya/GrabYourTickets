import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

import Auth from "./AuthModal"

export default function Navbar() {
  const location = useLocation()
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState("login")

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Branding / Logo */}
        <Link to="/" className="flex items-center gap-2">
          {/* Logo image */}
          <img
            src="/images/logo.png" // <-- update this to your actual file name
            alt="GrabYourTickets Logo"
            className="w-10 h-10 object-contain"
          />
          
          {/* Brand text */}
          <span className="text-xl md:text-2xl font-bold text-white hover:text-red-500 transition">
            GrabYourTickets
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8">
          <li>
            <Link
              to="/"
              className={`transition font-medium ${isActive("/") ? "text-red-500" : "text-gray-300 hover:text-white"}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/movies"
              className={`transition font-medium ${isActive("/movies") ? "text-red-500" : "text-gray-300 hover:text-white"}`}
            >
              Movies
            </Link>
          </li>
          <li>
            <Link
              to="/theatres"
              className={`transition font-medium ${isActive("/theatres") ? "text-red-500" : "text-gray-300 hover:text-white"}`}
            >
              Theatres
            </Link>
          </li>
          <li>
            <Link
              to="/new-releases"
              className={`transition font-medium ${isActive("/new-releases") ? "text-red-500" : "text-gray-300 hover:text-white"}`}
            >
              New Releases
            </Link>
          </li>
        </ul>

        {/* Login Button */}
        <button
          onClick={() => { setAuthMode("login"); setShowAuth(true) }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition"
        >
          Login
        </button>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <Auth
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      )}
    </nav>
  )
}
