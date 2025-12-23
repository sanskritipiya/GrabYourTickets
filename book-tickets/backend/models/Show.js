const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },

    showDate: {
      type: String, // YYYY-MM-DD
      required: true
    },

    time: {
      type: String, // 10:30 AM
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
