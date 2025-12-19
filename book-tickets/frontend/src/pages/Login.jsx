import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "user" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:3000/api/auth/login", {
        email: form.email,
        password: form.password,
        role: form.role,
      });

      const { token, id, name, email, role } = res.data;

      // Save token and user/admin data to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("token", token); // Also save as 'token' for compatibility
      
      // Save user or admin data with all details
      const userData = { id, name, email, role };
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Also save role separately for easy access
      localStorage.setItem("userRole", role);

      if (role === "admin") {
        toast.success("Admin Logged In Successfully!");
        setTimeout(() => {
          navigate("/admin/dashboard"); // Navigate to admin dashboard
          window.location.reload(); // optional to update UI
        }, 800);
      } else {
        toast.success("Logged In Successfully!");
        setTimeout(() => {
          navigate("/"); // Navigate to user homepage
          window.location.reload();
        }, 800);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center py-12 px-4">
      <ToastContainer position="top-center" autoClose={1500} />
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg p-8 text-white">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 outline-none focus:border-red-500 text-white"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-400 hover:text-red-300 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
