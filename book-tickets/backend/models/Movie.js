const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  releaseDate: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  trailerUrl: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Movie", movieSchema);

