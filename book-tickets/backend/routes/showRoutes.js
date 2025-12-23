const express = require("express");
const router = express.Router();

const {
  addShow,
  getAllShows,
  getShowById,
  updateShow,
  deleteShow
} = require("../controllers/showController");

const { protect, admin } = require("../middleware/authMiddleware");

// PUBLIC
router.get("/", getAllShows);
router.get("/:id", getShowById);

// ADMIN
router.post("/", protect, admin, addShow);
router.put("/:id", protect, admin, updateShow);
router.delete("/:id", protect, admin, deleteShow);

module.exports = router;
