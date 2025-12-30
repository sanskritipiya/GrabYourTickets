import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => (
  <footer className="bg-gray-900 border-t border-gray-800 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">GrabYourTicekts</h3>
          <p className="text-gray-400 text-sm">
            Your ultimate destination for movie tickets and cinema experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-red-500 transition">Home</Link>
            </li>
            <li>
              <Link to="/movies" className="text-gray-400 hover:text-red-500 transition">All Movies</Link>
            </li>
            <li>
              <Link to="/new-releases" className="text-gray-400 hover:text-red-500 transition">New Releases</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-400 hover:text-red-500 transition">Contact Us</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-red-500 transition">FAQ</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-red-500 transition">Terms & Conditions</a>
            </li>
            <li>
              <a href="#" className="text-gray-400 hover:text-red-500 transition">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-white font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition">
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition">
              <Twitter className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition">
              <Facebook className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition">
              <Youtube className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 pt-8">
        <p className="text-gray-400 text-center text-sm">
          © 2025 GrabYourTicktes. All rights reserved. | Premium Movie Booking Experience
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
