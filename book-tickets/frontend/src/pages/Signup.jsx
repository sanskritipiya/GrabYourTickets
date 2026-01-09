import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertTriangle, AlertCircle, CheckCircle, X } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [toast, setToast] = useState(null);

  // Custom Toast Function
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getToastStyles = () => {
    switch (toast?.type) {
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          text: "text-yellow-800",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          text: "text-red-800",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          text: "text-green-800",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
          text: "text-blue-800",
        };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (/^\d+@/.test(form.email)) {
      showToast("Email cannot start with only numbers", "error");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:3000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      showToast("Registered successfully", "success");

      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (error) {
      showToast(error.response?.data?.message || "Signup failed", "error");
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center py-12 px-4">
      {/* Custom Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div
            className={`${getToastStyles().bg} ${getToastStyles().border} border rounded-lg px-6 py-4 shadow-lg min-w-[400px] max-w-[500px]`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{getToastStyles().icon}</div>
              <p className={`${getToastStyles().text} font-medium flex-1`}>{toast.message}</p>
              <button
                onClick={() => setToast(null)}
                className={`flex-shrink-0 ${getToastStyles().text} opacity-40 hover:opacity-100 transition-opacity`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-8 text-white">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Sign Up</h2>
          <p className="text-gray-400 text-sm mt-1">
            Create a new account to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 outline-none focus:border-red-500"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 outline-none focus:border-red-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 outline-none focus:border-red-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-medium transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-400 hover:text-red-300 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}