const express = require("express");
const router = express.Router();

const {
  addCinema,
  getAllCinemas,
  getCinemaById,
  getCinemaWithShows,
  updateCinema,
  deleteCinema
} = require("../controllers/cinemaController");

const { protect, admin } = require("../middleware/authMiddleware");

/* ================= PUBLIC ================= */

// Get all cinemas (supports ?location=)
router.get("/", getAllCinemas);

// Get cinema by ID
router.get("/:id", getCinemaById);

// ⭐ Get cinema WITH its shows
router.get("/:id/shows", getCinemaWithShows);

/* ================= ADMIN ================= */

// Add cinema
router.post("/", protect, admin, addCinema);

// Update cinema
router.put("/:id", protect, admin, updateCinema);

// Delete cinema (also deletes shows)
router.delete("/:id", protect, admin, deleteCinema);

module.exports = router;