const express = require("express");
const router = express.Router();

const {
  addHero,
  getAllHeroes,
  getHeroById,
  updateHero,
  deleteHero,
} = require("../controllers/heroController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer


router.get("/", getAllHeroes);
router.get("/:id", getHeroById);


// ADD HERO (IMAGE REQUIRED)
router.post(
  "/",
  protect,
  admin,
  upload.single("backgroundImage"), 
  addHero
);

// UPDATE HERO (IMAGE OPTIONAL)
router.put(
  "/:id",
  protect,
  admin,
  upload.single("backgroundImage"), 
  updateHero
);

// DELETE HERO
router.delete(
  "/:id",
  protect,
  admin,
  deleteHero
);

module.exports = router;
