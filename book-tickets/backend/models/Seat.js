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

    movieId: {  // ✅ NEW FIELD
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    movieName: {  // ✅ NEW FIELD
      type: String,
      required: true,
      trim: true,
    },

    hallName: {
      type: String,
      required: true,
      trim: true,
    },

    row: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    column: {
      type: Number,
      required: true,
      min: 1,
    },

    seatNumber: {
      type: String,
      trim: true,
    },

    isBestRow: {
      type: Boolean,
      default: false,
    },

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

// Prevent duplicate seats
seatSchema.index(
  { cinemaId: 1, showId: 1, hallName: 1, row: 1, column: 1 },
  { unique: true }
);

// Speed up seat availability queries
seatSchema.index({
  cinemaId: 1,
  showId: 1,
  hallName: 1,
  status: 1,
});

module.exports = mongoose.model("Seat", seatSchema);