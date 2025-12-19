import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, LayoutDashboard, Armchair, ImageIcon, Calendar, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between">
      {/* Top menu */}
      <div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">GrabYourTickets Admin</h1>
        </div>
        <nav className="px-3">
          <Link
            to="/admin/dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              isActive("/admin/dashboard") ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/admin/movies"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              isActive("/admin/movies") ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Film className="w-5 h-5" />
            <span className="font-medium">Movies</span>
          </Link>

          <Link
            to="/admin/add-shows"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              isActive("/admin/add-shows") ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Armchair className="w-5 h-5" />
            <span className="font-medium">Add Shows</span>
          </Link>

          <Link
            to="/admin/view-bookings"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              isActive("/admin/view-bookings") ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Bookings</span>
          </Link>

          <Link
            to="/admin/hero-section"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              isActive("/admin/hero-section") ? "bg-red-700 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Hero Section</span>
          </Link>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-6">
        <button
          onClick={() => {
            // Clear all localStorage data
            localStorage.removeItem("authToken");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userRole");
            // Navigate to login page
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-red-700 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
