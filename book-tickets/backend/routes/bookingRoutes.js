const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

// Create booking (can be with or without auth - will check for userEmail if not authenticated)
router.post("/", createBooking);

// Get user's bookings (requires auth)
router.get("/my-bookings", protect, getUserBookings);

// Get booking by ID (requires auth)
router.get("/:id", protect, getBookingById);

// Cancel booking (requires auth)
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;