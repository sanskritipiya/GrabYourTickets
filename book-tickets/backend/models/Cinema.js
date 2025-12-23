const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true   // 👈 recommended
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cinema", cinemaSchema);
