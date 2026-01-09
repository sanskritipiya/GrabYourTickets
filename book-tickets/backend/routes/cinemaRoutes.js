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

// PUBLIC
router.get("/", getAllCinemas);
router.get("/:id/shows", getCinemaWithShows); // ⚠️ MUST be before :id
router.get("/:id", getCinemaById);

// ADMIN
router.post("/", protect, admin, addCinema);
router.put("/:id", protect, admin, updateCinema);
router.delete("/:id", protect, admin, deleteCinema);

module.exports = router;
