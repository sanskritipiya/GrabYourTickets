const express = require("express");
const router = express.Router();
const {
  addMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const { protect, admin } = require("../middleware/authMiddleware");


router.get("/", getMovies);        // GET all movies
router.get("/:id", getMovieById);  // GET movie by ID


router.post("/", protect, admin, addMovie);      // Add new movie
router.put("/:id", protect, admin, updateMovie); // Update existing movie
router.delete("/:id", protect, admin, deleteMovie); // Delete movie

module.exports = router;
