const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },

    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    hallName: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ FIXED: Row is STRING (A, B, C...)
    row: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    // Seat number: 1,2,3,4...
    column: {
      type: Number,
      required: true,
      min: 1,
    },

    // Seat identifier: A1, A2, B1, etc.
    seatNumber: {
      type: String,
      trim: true,
    },

    // Best row indicator (middle rows are usually best)
    isBestRow: {
      type: Boolean,
      default: false,
    },

    // Center seat indicator (seats near center column)
    isCenterSeat: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate seats
seatSchema.index(
  { cinemaId: 1, showId: 1, hallName: 1, row: 1, column: 1 },
  { unique: true }
);

// ✅ Speed up recommendation queries
seatSchema.index({
  cinemaId: 1,
  showId: 1,
  hallName: 1,
  status: 1,
});

module.exports = mongoose.model("Seat", seatSchema);
