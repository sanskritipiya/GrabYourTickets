const Seat = require("../models/Seat");
const mongoose = require("mongoose");

const isValidObjectId = id =>
  mongoose.Types.ObjectId.isValid(id);

/* ================= ADD SEATS ================= */
exports.addSeats = async (req, res) => {
  try {
    const { cinemaId, showId, hallName, seats } = req.body;

    if (
      !isValidObjectId(cinemaId) ||
      !isValidObjectId(showId) ||
      !hallName ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "cinemaId, showId, hallName and seats are required",
      });
    }

    const seatDocs = seats.map(s => ({
      cinemaId,
      showId,
      hallName,
      row: s.row,
      column: s.column,
      status: "AVAILABLE",
    }));

    const created = await Seat.insertMany(seatDocs, { ordered: false });

    res.status(201).json({
      success: true,
      totalSeatsCreated: created.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET ALL SEATS ================= */
exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find()
      .populate("cinemaId")
      .populate("showId");

    res.json({
      success: true,
      seats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET SEATS BY HALL ================= */
exports.getSeatsByHall = async (req, res) => {
  try {
    const { cinemaId } = req.params;
    const { hallName, showId } = req.query;

    if (
      !isValidObjectId(cinemaId) ||
      !isValidObjectId(showId) ||
      !hallName
    ) {
      return res.status(400).json({
        success: false,
        message: "cinemaId, showId and hallName required",
      });
    }

    const seats = await Seat.find({
      cinemaId,
      showId,
      hallName,
    }).sort({ row: 1, column: 1 });

    res.json({
      success: true,
      seats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= RECOMMEND SEATS ================= */
exports.recommendSeats = async (req, res) => {
  try {
    const { cinemaId, hallName, showId, count = 2 } = req.query;

    if (
      !isValidObjectId(cinemaId) ||
      !isValidObjectId(showId) ||
      !hallName
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid cinemaId, showId or hallName",
      });
    }

    const seatCount = Number(count);

    const seats = await Seat.find({
      cinemaId,
      showId,
      hallName,
      status: "AVAILABLE",
    }).lean();

    if (!seats.length) {
      return res.status(404).json({
        success: false,
        message: "No available seats",
      });
    }

    const rows = {};
    seats.forEach(seat => {
      if (!rows[seat.row]) rows[seat.row] = [];
      rows[seat.row].push(seat);
    });

    for (const row of Object.keys(rows)) {
      const rowSeats = rows[row].sort((a, b) => a.column - b.column);

      for (let i = 0; i <= rowSeats.length - seatCount; i++) {
        let ok = true;

        for (let j = 1; j < seatCount; j++) {
          if (rowSeats[i + j].column !== rowSeats[i].column + j) {
            ok = false;
            break;
          }
        }

        if (ok) {
          return res.json({
            success: true,
            recommendedSeats: rowSeats.slice(i, i + seatCount),
          });
        }
      }
    }

    res.status(404).json({
      success: false,
      message: "No consecutive seats found",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= BOOK SEAT ================= */
exports.bookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

    if (!isValidObjectId(seatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid seatId",
      });
    }

    const seat = await Seat.findOneAndUpdate(
      { _id: seatId, status: "AVAILABLE" },
      { status: "BOOKED" },
      { new: true }
    );

    if (!seat) {
      return res.status(400).json({
        success: false,
        message: "Seat already booked",
      });
    }

    res.json({ success: true, seat });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deleteSeatsByHall = async (req, res) => {
  try {
    const { cinemaId, hallName } = req.body;

    if (!cinemaId || !hallName) {
      return res.status(400).json({
        success: false,
        message: "cinemaId and hallName required",
      });
    }

    await Seat.deleteMany({ cinemaId, hallName });

    res.json({
      success: true,
      message: "Seats deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
