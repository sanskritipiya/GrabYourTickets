const express = require("express");
const router = express.Router();
const {
  addHero,
  getAllHeroes,
  getHeroById,
  updateHero,
  deleteHero
} = require("../controllers/heroController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllHeroes);      // GET /api/heroes
router.get("/:id", getHeroById);   // GET /api/heroes/:id

// Admin-only routes
router.post("/", protect, admin, addHero);          // POST /api/heroes
router.put("/:id", protect, admin, updateHero);     // PUT /api/heroes/:id
router.delete("/:id", protect, admin, deleteHero);  // DELETE /api/heroes/:id

module.exports = router;
