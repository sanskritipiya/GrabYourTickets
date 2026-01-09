const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/authMiddleware");

// ================= ADMIN ROUTES =================

// Get all bookings (ADMIN ONLY)
router.get("/all", protect, admin, bookingController.getAllBookings);

// FORCE DELETE BOOKING (ADMIN ONLY)
router.delete(
  "/admin/force/:id",
  protect,
  admin,
  bookingController.forceDeleteBooking
);

// Delete N/A or CANCELLED booking (ADMIN ONLY)
router.delete(
  "/admin/:id",
  protect,
  admin,
  bookingController.deleteBooking
);

// ================= USER ROUTES =================

// Create booking
router.post("/", protect, bookingController.createBooking);

// Get logged-in user's bookings
router.get("/my", protect, bookingController.getUserBookings);

// Get booking by ID
router.get("/:id", protect, bookingController.getBookingById);

// Cancel booking (USER)
router.delete("/:id", protect, bookingController.cancelBooking);

module.exports = router;
