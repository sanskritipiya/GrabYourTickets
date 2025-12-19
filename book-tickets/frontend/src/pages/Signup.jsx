import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:3000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Registered Successfully!");

      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 800);

    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center py-12 px-4">
      <ToastContainer position="top-center" autoClose={1500} />
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-8 text-white">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Sign Up</h2>
          <p className="text-gray-400 text-sm mt-1">Create a new account to get started.</p>
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
          <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

