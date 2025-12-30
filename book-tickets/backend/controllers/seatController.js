const Seat = require("../models/Seat");
const mongoose = require("mongoose");

const isValidObjectId = id =>
  mongoose.Types.ObjectId.isValid(id);

/* ================= ADD SEATS (SMART) ================= */
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

    // 🧠 Analyze rows & columns
    const rows = [...new Set(seats.map(s => s.row))].sort();
    const columns = [...new Set(seats.map(s => s.column))].sort((a, b) => a - b);

    const centerRowIndex = Math.floor(rows.length / 2);
    const bestRowIndexes = [
      centerRowIndex - 1,
      centerRowIndex,
      centerRowIndex + 1,
    ];

    const centerColumn = columns[Math.floor(columns.length / 2)];

    const seatDocs = seats.map(s => {
      const rowIndex = rows.indexOf(s.row);
      const rowLetter = String.fromCharCode(65 + rowIndex); // A B C
      const seatNumber = `${rowLetter}${s.column}`;

      const isBestRow = bestRowIndexes.includes(rowIndex);
      const isCenterSeat = Math.abs(s.column - centerColumn) <= 1;

      return {
        cinemaId,
        showId,
        hallName,
        row: rowLetter,     // A B C
        column: s.column,
        seatNumber,         // A1 A2
        isBestRow,
        isCenterSeat,
        status: "AVAILABLE",
      };
    });

    const created = await Seat.insertMany(seatDocs, { ordered: false });

    res.status(201).json({
      success: true,
      totalSeatsCreated: created.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL SEATS ================= */
exports.getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find()
      .populate("cinemaId")
      .populate("showId");

    res.json({ success: true, seats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

    res.json({ success: true, seats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= RECOMMEND SEATS ================= */
exports.recommendSeats = async (req, res) => {
  try {
    const { cinemaId, hallName, showId, count = 2, mode = "row" } = req.query;

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

    // 🎯 BEST SEATS MODE: Return best seats from each row
    if (mode === "best" || mode === "BEST") {
      // Group seats by row
      const rows = {};
      seats.forEach(seat => {
        if (!rows[seat.row]) rows[seat.row] = [];
        rows[seat.row].push(seat);
      });

      // Get all available rows, prioritize best rows
      const availableRows = Object.keys(rows).sort((a, b) => {
        const aHasBest = rows[a].some(s => s.isBestRow);
        const bHasBest = rows[b].some(s => s.isBestRow);
        if (aHasBest && !bHasBest) return -1;
        if (!aHasBest && bHasBest) return 1;
        return a.localeCompare(b);
      });

      const recommendedSeats = [];

      // For each row, find the best seat(s)
      for (const row of availableRows) {
        const rowSeats = rows[row].sort((a, b) => {
          // Prioritize: best row + center seat > best row > center seat > others
          const aScore = (a.isBestRow ? 10 : 0) + (a.isCenterSeat ? 5 : 0);
          const bScore = (b.isBestRow ? 10 : 0) + (b.isCenterSeat ? 5 : 0);
          if (bScore !== aScore) return bScore - aScore;
          // If same score, prefer center columns
          const centerCol = Math.floor(
            (Math.min(...rowSeats.map(s => s.column)) +
              Math.max(...rowSeats.map(s => s.column))) /
              2
          );
          return (
            Math.abs(a.column - centerCol) - Math.abs(b.column - centerCol)
          );
        });

        // Take up to 2 best seats from each row
        const seatsFromRow = rowSeats.slice(0, 2);
        recommendedSeats.push(...seatsFromRow);

        // Limit total recommendations to 8-10 seats
        if (recommendedSeats.length >= 10) break;
      }

      return res.json({
        success: true,
        recommendedSeats: recommendedSeats.map(seat => ({
          seatId: seat._id,
          label: seat.seatNumber || `${seat.row}${seat.column}`,
          row: seat.row,
          column: seat.column,
        })),
      });
    }

    // 🎯 SAME ROW MODE: Find consecutive seats in the same row
    // ⭐ Prioritize best rows first
    seats.sort((a, b) => {
      if (b.isBestRow !== a.isBestRow) return b.isBestRow - a.isBestRow;
      return a.row.localeCompare(b.row);
    });

    const rows = {};
    seats.forEach(seat => {
      if (!rows[seat.row]) rows[seat.row] = [];
      rows[seat.row].push(seat);
    });

    for (const row in rows) {
      const rowSeats = rows[row].sort((a, b) => a.column - b.column);

      for (let i = 0; i <= rowSeats.length - count; i++) {
        let consecutive = true;

        for (let j = 1; j < count; j++) {
          if (rowSeats[i + j].column !== rowSeats[i].column + j) {
            consecutive = false;
            break;
          }
        }

        if (consecutive) {
          return res.json({
            success: true,
            recommendedSeats: rowSeats.slice(i, i + count).map(seat => ({
              seatId: seat._id,
              label: seat.seatNumber || `${seat.row}${seat.column}`,
              row: seat.row,
              column: seat.column,
            })),
          });
        }
      }
    }

    res.status(404).json({
      success: false,
      message: "No consecutive seats found",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= BOOK SEAT ================= */
exports.bookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

    if (!isValidObjectId(seatId)) {
      return res.status(400).json({ success: false, message: "Invalid seatId" });
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
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET SEAT BY ID ================= */
exports.getSeatById = async (req, res) => {
  try {
    const { seatId } = req.params;

    if (!isValidObjectId(seatId)) {
      return res.status(400).json({ success: false, message: "Invalid seatId" });
    }

    const seat = await Seat.findById(seatId);

    if (!seat) {
      return res.status(404).json({ success: false, message: "Seat not found" });
    }

    res.json({ success: true, seat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= EDIT SEAT ================= */
exports.editSeat = async (req, res) => {
  try {
    const { seatId, row, column, status } = req.body;

    if (!isValidObjectId(seatId)) {
      return res.status(400).json({ success: false, message: "Invalid seatId" });
    }

    const seat = await Seat.findByIdAndUpdate(
      seatId,
      { row, column, status },
      { new: true }
    );

    res.json({ success: true, seat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE SEATS BY HALL ================= */
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
    res.status(500).json({ success: false, message: err.message });
  }
};
