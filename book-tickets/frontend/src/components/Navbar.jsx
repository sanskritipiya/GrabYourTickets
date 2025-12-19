import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Navbar() {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const loadSession = () => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    setIsLoggedIn(!!token)

    if (!storedUser) {
      setUser(null)
      return
    }

    try {
      setUser(JSON.parse(storedUser))
    } catch {
      console.log("Invalid user JSON")
      setUser(null)
    }
  }

  // Load user from localStorage on mount and when location changes
  useEffect(() => {
    loadSession()
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    setUser(null)
    setIsLoggedIn(false)
    setDropdownOpen(false)
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="logo.png" alt="GrabYourTickets Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl md:text-2xl font-bold text-white hover:text-red-500 transition">
            GrabYourTickets
          </span>
        </Link>

        {/* Nav Links */}
        <ul className="flex items-center gap-8">
          <li>
            <Link
              to="/"
              className={`transition font-medium ${
                isActive("/") ? "text-red-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/movies"
              className={`transition font-medium ${
                isActive("/movies") ? "text-red-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Movies
            </Link>
          </li>

          <li>
            <Link
              to="/theatres"
              className={`transition font-medium ${
                isActive("/theatres") ? "text-red-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Theatres
            </Link>
          </li>

          <li>
            <Link
              to="/new-releases"
              className={`transition font-medium ${
                isActive("/new-releases") ? "text-red-500" : "text-gray-300 hover:text-white"
              }`}
            >
              New Releases
            </Link>
          </li>
        </ul>

        {/* User Section */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-gray-800 px-3 py-2 rounded-full flex items-center gap-2 hover:bg-gray-700 transition"
              aria-expanded={dropdownOpen}
            >
              <img
                src="/user-icon.png"
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                <Link
                  to="/my-tickets"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  View Bookings
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className={`transition font-medium ${
                isActive("/login") ? "text-red-500" : "text-gray-300 hover:text-white"
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
