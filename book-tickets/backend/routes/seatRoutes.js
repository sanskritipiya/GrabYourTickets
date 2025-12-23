const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");

router.post("/", seatController.addSeats);
router.get("/", seatController.getAllSeats);
router.get("/cinema/:cinemaId", seatController.getSeatsByHall);
router.get("/recommend", seatController.recommendSeats);
router.post("/book", seatController.bookSeat);
router.delete("/", seatController.deleteSeatsByHall);


module.exports = router;
