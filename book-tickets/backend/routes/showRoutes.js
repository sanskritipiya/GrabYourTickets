const express = require("express");
const router = express.Router();
const {
  addShow,
  getShows,
  getShowById,
  updateShow,
  deleteShow,
} = require("../controllers/showController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getShows);
router.get("/:id", getShowById);

// Admin routes
router.post("/", protect, admin, addShow);
router.put("/:id", protect, admin, updateShow);
router.delete("/:id", protect, admin, deleteShow);

module.exports = router;

