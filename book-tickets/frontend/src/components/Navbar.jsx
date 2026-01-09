import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Navbar() {
  const location = useLocation()

  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)

  const isActive = (path) => location.pathname === path

  const loadSession = () => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    const role = localStorage.getItem("userRole")

    setUserRole(role)

    // ❌ Admin should NOT be treated as a logged-in user here
    if (!token || role === "admin") {
      setIsLoggedIn(false)
      setUser(null)
      return
    }

    setIsLoggedIn(true)

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

  useEffect(() => {
    loadSession()
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("userRole")

    setUser(null)
    setIsLoggedIn(false)
    setDropdownOpen(false)
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 relative flex items-center">

        {/* Logo (LEFT) */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/popcorn.png"
            alt="GrabYourTickets Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl md:text-2xl font-semibold text-white hover:text-red-500 transition">
            GrabYourTickets
          </span>
        </Link>

        {/* NAV LINKS (PERFECT CENTER) */}
        <ul className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
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
                isActive("/movies")
                  ? "text-red-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Movies
            </Link>
          </li>

          <li>
            <Link
              to="/new-releases"
              className={`transition font-medium ${
                isActive("/new-releases")
                  ? "text-red-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              New Releases
            </Link>
          </li>
        </ul>

        {/* RIGHT SIDE (LOGIN / PROFILE) */}
        <div className="ml-auto">
          {isLoggedIn ? (
            <div className="relative">
              {/* Profile Icon */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-semibold text-gray-800 hover:bg-gray-200 transition"
              >
                {user?.email?.charAt(0)?.toUpperCase()}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/my-tickets"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    View Bookings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
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
                  isActive("/login")
                    ? "text-red-500"
                    : "text-gray-300 hover:text-white"
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
      </div>
    </nav>
  )
}