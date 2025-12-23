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
    },

    row: {
      type: Number,
      required: true,
    },

    column: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

// prevent duplicate seat
seatSchema.index(
  { cinemaId: 1, showId: 1, hallName: 1, row: 1, column: 1 },
  { unique: true }
);

module.exports = mongoose.model("Seat", seatSchema);
