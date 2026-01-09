const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public
router.get("/recommend", seatController.recommendSeats);
router.get("/", seatController.getAllSeats);
router.get("/:seatId", seatController.getSeatById);

// Admin
router.post("/", protect, admin, seatController.addSeats);
router.put("/edit", protect, admin, seatController.editSeat);
router.delete("/", protect, admin, seatController.deleteSeatsByHall);


module.exports = router;
