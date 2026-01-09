const Seat = require("../models/Seat");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ================= ADD SEATS (SMART) ================= */
/* ================= ADD SEATS (SMART) ================= */
exports.addSeats = async (req, res) => {
  try {
    const { cinemaId, showId, movieId, movieName, hallName, seats } = req.body;

    if (
      !isValidObjectId(cinemaId) ||
      !isValidObjectId(showId) ||
      !isValidObjectId(movieId) ||
      !movieName ||
      !hallName ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "cinemaId, showId, movieId, movieName, hallName and seats are required",
      });
    }

    const rows = [...new Set(seats.map((s) => s.row))].sort();
    const columns = [...new Set(seats.map((s) => s.column))].sort(
      (a, b) => a - b
    );

    const centerRowIndex = Math.floor(rows.length / 2);
    const bestRowIndexes = [
      centerRowIndex - 1,
      centerRowIndex,
      centerRowIndex + 1,
    ];

    const centerColumn = columns[Math.floor(columns.length / 2)];

    const seatDocs = seats.map((s) => {
      const rowIndex = rows.indexOf(s.row);
      const rowLetter = String.fromCharCode(65 + rowIndex);
      const seatNumber = `${rowLetter}${s.column}`;

      return {
        cinemaId,
        showId,
        movieId,        // ✅ ADD THIS
        movieName,      // ✅ ADD THIS
        hallName,
        row: rowLetter,
        column: s.column,
        seatNumber,
        isBestRow: bestRowIndexes.includes(rowIndex),
        isCenterSeat: Math.abs(s.column - centerColumn) <= 1,
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
    const { cinemaId, showId } = req.query;
    const filter = {};

    if (cinemaId && isValidObjectId(cinemaId)) filter.cinemaId = cinemaId;
    if (showId && isValidObjectId(showId)) filter.showId = showId;

    const seats = await Seat.find(filter)
      .populate("cinemaId")
      .populate("showId")
      .sort({ row: 1, column: 1 });

    res.json({ success: true, totalSeats: seats.length, seats });
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
        message: "cinemaId, showId and hallName are required",
      });
    }

    const seats = await Seat.find({
      cinemaId,
      showId,
      hallName,
    }).sort({ row: 1, column: 1 });

    res.json({ success: true, totalSeats: seats.length, seats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= RECOMMEND SEATS (FIXED - RETURNS ALL GROUPS) ================= */
/* ================= RECOMMEND SEATS (FIXED - SHOWS ALL ROWS) ================= */
exports.recommendSeats = async (req, res) => {
  try {
    const { cinemaId, hallName, showId, count = 2, mode = "row" } = req.query;

    console.log("Recommend seats params:", { cinemaId, hallName, showId, count, mode });

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

    const seatCount = Math.min(Math.max(parseInt(count) || 2, 1), 20);

    // Get all seats for this show/hall
    const allSeats = await Seat.find({
      cinemaId,
      showId,
      hallName,
    }).lean();

    console.log("Total seats found:", allSeats.length);
    console.log("Sample seats:", allSeats.slice(0, 3).map(s => ({ 
      seatNumber: s.seatNumber, 
      status: s.status 
    })));

    // Filter for available seats
    const seats = allSeats.filter(s => s.status === "AVAILABLE");

    console.log("Available seats:", seats.length);

    if (!seats.length) {
      return res.status(404).json({
        success: false,
        message: "No available seats",
      });
    }

    // Group seats by row
    const rows = {};
    seats.forEach((seat) => {
      if (!rows[seat.row]) rows[seat.row] = [];
      rows[seat.row].push(seat);
    });

    /* ================= BEST MODE (TOP 5 GROUPS ACROSS ALL ROWS) ================= */
    if (mode.toLowerCase() === "best") {
      const allGroups = [];

      for (const row of Object.keys(rows).sort()) {
        const rowSeats = rows[row].sort((a, b) => a.column - b.column);

        for (let i = 0; i <= rowSeats.length - seatCount; i++) {
          let valid = true;

          for (let j = 1; j < seatCount; j++) {
            if (rowSeats[i + j].column !== rowSeats[i].column + j) {
              valid = false;
              break;
            }
          }

          if (valid) {
            const group = rowSeats.slice(i, i + seatCount);
            const score = group.reduce(
              (s, seat) =>
                s + (seat.isBestRow ? 10 : 0) + (seat.isCenterSeat ? 5 : 0),
              0
            );

            allGroups.push({ group, score });
          }
        }
      }

      if (!allGroups.length) {
        return res.status(404).json({
          success: false,
          message: "No consecutive seats found",
        });
      }

      // Sort by score and return top 5 groups
      allGroups.sort((a, b) => b.score - a.score);
      const topGroups = allGroups.slice(0, 5);

      console.log("Best mode - returning", topGroups.length, "groups");

      return res.json({
        success: true,
        recommendedGroups: topGroups.map((g) => ({
          row: g.group[0].row,
          score: g.score,
          seats: g.group.map((seat) => ({
            seatId: seat._id,
            label: seat.seatNumber,
            row: seat.row,
            column: seat.column,
          })),
        })),
      });
    }

    /* ================= ROW MODE (BEST GROUP IN EACH ROW) ================= */
    const bestInEachRow = [];

    for (const row of Object.keys(rows).sort()) {
      const rowSeats = rows[row].sort((a, b) => a.column - b.column);
      const rowGroups = [];

      for (let i = 0; i <= rowSeats.length - seatCount; i++) {
        let valid = true;

        for (let j = 1; j < seatCount; j++) {
          if (rowSeats[i + j].column !== rowSeats[i].column + j) {
            valid = false;
            break;
          }
        }

        if (valid) {
          const group = rowSeats.slice(i, i + seatCount);
          const score = group.reduce(
            (s, seat) =>
              s + (seat.isBestRow ? 10 : 0) + (seat.isCenterSeat ? 5 : 0),
            0
          );

          rowGroups.push({ group, score });
        }
      }

      // Get the best group in this row
      if (rowGroups.length > 0) {
        rowGroups.sort((a, b) => b.score - a.score);
        const bestGroup = rowGroups[0];
        
        bestInEachRow.push({
          row: bestGroup.group[0].row,
          score: bestGroup.score,
          seats: bestGroup.group.map((seat) => ({
            seatId: seat._id,
            label: seat.seatNumber,
            row: seat.row,
            column: seat.column,
          })),
        });
      }
    }

    if (!bestInEachRow.length) {
      return res.status(404).json({
        success: false,
        message: "No consecutive seats available",
      });
    }

    console.log("Row mode - returning", bestInEachRow.length, "groups (one per row)");

    res.json({
      success: true,
      recommendedGroups: bestInEachRow,
    });
  } catch (err) {
    console.error("Recommend seats error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET SEAT BY ID ================= */
exports.getSeatById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid seat ID" });
    }

    const seat = await Seat.findById(id);

    if (!seat) {
      return res.status(404).json({ success: false, message: "Seat not found" });
    }

    res.json({ success: true, seat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// EDIT SEAT//
exports.editSeat = async (req, res) => {
  try {
    const { seatId, row, column, status } = req.body;

    if (!isValidObjectId(seatId)) {
      return res.status(400).json({ success: false, message: "Invalid seatId" });
    }

    const update = {};
    if (row) update.row = row;
    if (column) update.column = column;
    if (row && column) update.seatNumber = `${row}${column}`;
    if (status) update.status = status;

    const seat = await Seat.findByIdAndUpdate(seatId, update, { new: true });

    res.json({ success: true, seat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE SEATS (BY CINEMA + HALL + SHOW) //
exports.deleteSeatsByHall = async (req, res) => {
  try {
    const { cinemaId, hallName, showId } = req.body;

    if (
      !isValidObjectId(cinemaId) ||
      !isValidObjectId(showId) ||
      !hallName
    ) {
      return res.status(400).json({
        success: false,
        message: "cinemaId, hallName and showId are required",
      });
    }

    const result = await Seat.deleteMany({
      cinemaId,
      hallName,
      showId,
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Seats deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
