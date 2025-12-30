const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");

// Public Routes
router.get("/recommend", seatController.recommendSeats);
router.get("/cinema/:cinemaId", seatController.getSeatsByHall);
router.get("/", seatController.getAllSeats);
router.get("/:seatId", seatController.getSeatById);

router.post("/book", seatController.bookSeat);

// Admin Routes
router.post("/", seatController.addSeats);
router.put("/edit", seatController.editSeat);
router.delete("/", seatController.deleteSeatsByHall);


module.exports = router;