const express = require("express");
const router = express.Router();

const {
  addMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getNewReleases,
} = require("../controllers/movieController");

const upload = require("../middleware/upload");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getMovies);
router.get("/new-releases", getNewReleases);
router.get("/:id", getMovieById);

router.post("/", protect, admin, upload.single("image"), addMovie);
router.put("/:id", protect, admin, upload.single("image"), updateMovie);
router.delete("/:id", protect, admin, deleteMovie);

module.exports = router;
